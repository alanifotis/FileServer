'use strict';

import webauthnService from "./services/webauthn-service.js";
import http from "./utils/http.js";
import exceptionHandler from "./utils/HttpError.js";
import abortController from "./utils/abort-controller.js";
import base64url from "./utils/base64url.js";


const regex = /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/;

const path = window.location.pathname.replace(/\/$/, "");
const isPathRegister = path === '/register';

export default isPathRegister;

const hasPrf = await webauthnService.checkPrfSupport();

if (!hasPrf) {
    console.error("PRF extension not supported.");
    exceptionHandler.setInfoSpan("Your device doesn't support PRF. Try using Chrome on Desktop / Laptop.", "warning");
}

/**
 * Regexes the CSRF token from the Document Cookies.
 * @returns {string}
 */
function getCsrfToken() {
    return document.cookie.replace(regex, '$1');
}

if (!isPathRegister) {
    await automagic();
}

function parseAuthenticatorData(authDataBuffer) {
    const authData = new Uint8Array(authDataBuffer);

    console.log(`AuthData: ${base64url.encode(authData)}`);

    const view = new DataView(authData.buffer);

    // 2. Parse Fixed Fields
    // RP ID Hash (32 bytes)
    const rpIdHash = authData.slice(0, 32);

    // Flags (1 byte) - Index 32
    const flags = view.getUint8(32);

    // Sign Count (4 bytes) - Index 33, Big Endian
    const signCount = view.getUint32(33, false);

    // 3. Check for Attested Credential Data (Bit 6 of flags)
    // If this bit is set, the AAGUID follows immediately after the counter
    const hasAttestedData = !!(flags & 64);
    const hasExtensionData = !!(flags & 128);

    let aaguid = null;
    let credentialId = null;

    if (hasAttestedData) {
        // AAGUID is 16 bytes starting at index 37
        const aaguidBytes = authData.slice(37, 37 + 16);

        // Convert to standard UUID string format
        aaguid = stringifyUUID(aaguidBytes);

        // Credential ID Length (2 bytes)
        const credIdLen = view.getUint16(37 + 16, false);

        // Credential ID (Variable length)
        credentialId = authData.slice(37 + 16 + 2, 37 + 16 + 2 + credIdLen);
    }

    return {
        rpIdHash,
        flags: {
            userPresent: !!(flags & 1),
            userVerified: !!(flags & 4),
            attestedCredentialData: hasAttestedData,
            extensionDataIncluded: hasExtensionData
        },
        signCount,
        aaguid
    };
}

function stringifyUUID(arr) {
    const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0'));

    return [
        hex.slice(0, 4).join(''),
        hex.slice(4, 6).join(''),
        hex.slice(6, 8).join(''),
        hex.slice(8, 10).join(''),
        hex.slice(10, 16).join('')
    ].join('-');
}

// 4. Form Submission
exceptionHandler.ui.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!exceptionHandler.ui.emailInput.checkValidity()) {
        exceptionHandler.ui.emailInput.reportValidity();
        return;
    }

    const email = exceptionHandler.ui.emailInput.value;
    const csrfToken = getCsrfToken();

    // Fail fast if CSRF is missing
    if (!csrfToken) {
        exceptionHandler.setInfoSpan("Security Error: Missing CSRF Token. Please refresh the page.", "warning");
    }

    const headers = { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': csrfToken };

    exceptionHandler.resetPopups();
    exceptionHandler.setLoading(true);

    if (isPathRegister) {
        await registerWithoutPrf(email, headers);
    } else {
        await automagic(headers);
    }

});

async function registerWithoutPrf(email, headers, event) {

   if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    exceptionHandler.setLoading(true);
    exceptionHandler.setInfoSpan("", "info");

    try {

        const registrationOptions = await webauthnService.getRegistrationOptions(
            headers,
            '/registration/options',
            { email: email }
        );

        console.log(registrationOptions);

        if (registrationOptions.extensions) {
            registrationOptions.extensions = {};
        }

        const credentials = await webauthnService.createPasskey(registrationOptions);

        const payload = {
            email: email,
            credentials: credentials,
            prfContext: {
                salt: "noprf",
                wrappedKey: "noprf",
                iv: "noprf"
            }
        };

        const response = await http.post('/register', headers, payload);

        if (!response.ok) {
            throw new exceptionHandler.HttpError(response.status, "Registration failed on server.");
        }

        exceptionHandler.setInfoSpan("Account created successfully! Redirecting to login...", "success");        
        setTimeout(() => window.location.href = '/login', 1500);

    } catch (error) {
        exceptionHandler.handlePasskeyError(error);
    } finally {
        exceptionHandler.setLoading(false);
    }
}


async function registerWithPrf(email, headers) {
    const registrationOptions = await webauthnService.getRegistrationOptions(
        headers,
        '/registration/options',
        { email: email }
    );

    const salt = crypto.getRandomValues(new Uint8Array(32));

    registrationOptions.extensions.prf.eval.first = salt;


    const credentials = await webauthnService.createPasskey(registrationOptions);

    const authData = parseAuthenticatorData(credentials.response.getAuthenticatorData());

    console.log(authData);


    const prfResult = await webauthnService.createPrfSecretKey(credentials.getClientExtensionResults(), credentials.rawId, salt);

    let encryptionPayload = null;

    if (prfResult) {
        exceptionHandler.setInfoSpan("PRF Encryption Enabled.", "success");
        encryptionPayload = await webauthnService.createPayload(salt, prfResult);
    } else {
        exceptionHandler.setInfoSpan("Your device does not support secure encryption (PRF).", "warning");
    }

    const payload = {
        email: email,
        credentials: credentials,
        ...encryptionPayload
    }


    const request = {
        method: "POST",
        headers: {
            ...headers,
        },
        body: JSON.stringify(payload)
    };

    let credentialRecord = null;

    try {
        credentialRecord = await fetch('/register', request);
    } catch (error) {
        console.error(error);
        if (error.name === 'NotAllowedError') {
            exceptionHandler.setInfoSpan("Setup cancelled. Try again when ready.", "warning");
        } else if (error.name === 'AbortError') {
            exceptionHandler.setInfoSpan("The operation was aborted. Try again.", "error");
        } else {
            exceptionHandler.setInfoSpan(error.message || "An unexpected error occurred.", "error");
        }
    } finally {
        exceptionHandler.setLoading(false);
    }


    if (!credentialRecord.ok) {
        exceptionHandler.setInfoSpan(credentialRecord.statusText || "An unexpected error occurred.", 'error');
        return;
    }
    exceptionHandler.setInfoSpan("Account created successfully! Redirecting to login page...", "success");
    setTimeout(() => window.location.href = '/login', 2000);
}

async function automagic(headers) {
    exceptionHandler.setLoading(true);
    exceptionHandler.setInfoSpan("", "info");
        
    try {
        const optionsRes = await fetch('/automagic', {
            method: 'GET',
            headers: headers ? headers : { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() }
        });

        if (!optionsRes.ok) {
            throw new exceptionHandler.HttpError(optionsRes.status, "Failed to initialize login.");
        }

        const optionsData = await optionsRes.json();
        
        // Transform JSON to Binary (Safe parsing)
        const assertionOptions = PublicKeyCredential.parseRequestOptionsFromJSON(optionsData);

        // --- STEP 2: BROWSER PASSKEY PROMPT ---
        // This is where the browser takes over (FaceID, TouchID, Hello, etc.)
        const credential = await navigator.credentials.get({
            publicKey: assertionOptions,
            signal: abortController.newSignal(),
            mediation: 'optional' // 'conditional' is for autofill, 'optional' triggers modal immediately
        });

        // If 'get' resolves to null (rare, but possible in some flows), treat as cancellation
        if (!credential) {
            throw new DOMException("The operation was aborted.", "AbortError");
        }

        const attResponse = credential.toJSON();

        // --- STEP 3: VERIFY SIGNATURE (Send to Server) ---
        const verifyRes = await fetch('/automagic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken()
            },
            body: JSON.stringify(attResponse)
        });

        if (!verifyRes.ok) {
            throw new exceptionHandler.HttpError(verifyRes.status, "Verification failed.");
        }

        const verifyData = await verifyRes.json();

        if (!verifyData.authenticated) { 
             throw new Error("Authentication rejected by server.");
        }

        // --- SUCCESS ---
        exceptionHandler.setInfoSpan("Access granted! Redirecting...", "success");
        setTimeout(() => window.location.href = '/', 1500);

    } catch (error) {
        // Delegate to our specialized error handler
        exceptionHandler.handlePasskeyError(error);
    } finally {
        exceptionHandler.setLoading(false);
    }
}

async function login(email, headers) {
    const loginOptions = await webauthnService.getLoginOptions(
        headers,
        '/login/options',
        { email: email }
    );

    const credentialOptions = {
        publicKey: loginOptions.options,
        signal: abortController.newSignal(),
        mediation: "required"
    };

    for (let credId in loginOptions.authContexts) {
        const context = loginOptions.authContexts[credId];

        if (typeof context.salt === 'string') {
            context.salt = base64url.decode(context.salt);
            context.wrappedKey = base64url.decode(context.wrappedKey);
            context.iv = base64url.decode(context.iv);
        }
    }

    const assertionResponse = await navigator.credentials.get(credentialOptions);

    let credentialRecord = null;

    try {
        credentialRecord = await webauthnService.login('/login', headers, assertionResponse);
    } catch (error) {
        console.error(error);
        if (error.name === 'NotAllowedError') {
            exceptionHandler.setInfoSpan("Setup cancelled. Try again when ready.", "warning");
        } else if (error.name === 'AbortError') {
            exceptionHandler.setInfoSpan("The operation was aborted. Try again.", "error");
        } else {
            exceptionHandler.setInfoSpan(error.message || "An unexpected error occurred.", "error");
        }
    } finally {
        exceptionHandler.setLoading(false);
    }


    console.log(credentialRecord);

    if (!credentialRecord.ok) {
        exceptionHandler.setInfoSpan(credentialRecord.statusText || "An unexpected error occurred.", 'error');
        return;
    }

    exceptionHandler.setInfoSpan("Loged in successfully! Redirecting...", "success");
    setTimeout(() => window.location.href = '/', 1500);

}

exceptionHandler.ui.emailInput.addEventListener('input', () => {
    exceptionHandler.ui.submitBtn.disabled = !exceptionHandler.ui.emailInput.checkValidity();
});