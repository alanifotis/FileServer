'use strict';

import webauthnService from "./services/webauthn-service.js";
import http from "./utils/http.js";
import abortController from "./utils/abort-controller.js";
import base64url from "./utils/base64url.js";


const regex = /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/;

const path = window.location.pathname.replace(/\/$/, "");
const isPathRegister = path === '/register';

const ui = {
    form: document.getElementById('registerForm'),
    submitBtn: document.getElementById('submitBtn'),
    emailInput: document.getElementById('email'),
    infoArea: document.getElementById('formFeedback'),
    spinner: document.querySelector('.spinner')
};

/**  --- UI Helper Function ---
 * 
 * Toggles HTMLElement Visibility.
 * @param {HTMLElement} element The HTML UI element.
 * @param {Boolean} isVisible Visibility toggle.
 * @param {String} level - CSS class name can be warning, error or success.
 * @returns {void}
*/
function setVisibility(element, isVisible, level) {
    if (!element) return;
    if (isVisible) {
        element.classList.remove('hidden');
        element.classList.add(level)
    } else {
        element.classList.add('hidden');
        element.classList.remove(level);
    }
}


/**  --- UI Helper Function ---
 * 
 * Resets the information Text and Visibility.
 * @returns {void}
*/
function resetPopups() {
    setVisibility(ui.infoArea, false);
    ui.infoArea.textContent = '';
}

/**  --- UI Helper Function ---
 * 
 * Displays Information on the User.
 * @param {string} msg The message to be displayed.
 * @param {string} level - CSS class name can be warning, error or success.
 * @returns {void}
*/
function setInfoSpan(msg, level) {
    resetPopups(ui);
    if (!ui.infoArea) return;
    ui.infoArea.textContent = msg;
    setVisibility(ui.infoArea, true, level);
}


/**  --- UI Helper Function ---
 * 
 * Displays Information on the User.
 * @param {boolean} isLoading The message to be displayed.
 * @returns {void}
*/
function setLoading(isLoading) {
    ui.submitBtn.disabled = isLoading;
    if (isLoading) {
        ui.submitBtn.querySelector('.btn-text').textContent = 'Check your device...';
        ui.spinner.classList.remove('hidden');
    } else {
        ui.submitBtn.querySelector('.btn-text').textContent = isPathRegister ? 'Register' : 'Sign In';
        ui.spinner.classList.add('hidden');
    }
}



const hasPrf = await webauthnService.checkPrfSupport();

if (!hasPrf) {
    console.error("PRF extension not supported.");
    setInfoSpan(ui, "Your device doesn't support PRF. Try using Chrome on Desktop / Laptop.", "error");
}

/**
 * Regexes the CSRF token from the Document Cookies.
 * @returns {string}
 */
function getCsrfToken() {
    return document.cookie.replace(regex, '$1');
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
        aaguid // Will be null if not present
    };
}

// Fixed Helper: Convert 16 bytes to UUID string safely
function stringifyUUID(arr) {
    // Fix: Use Array.from() instead of [...arr] to prevent "not iterable" errors
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
ui.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!ui.emailInput.checkValidity()) {
        ui.emailInput.reportValidity();
        return;
    }

    const email = ui.emailInput.value;
    const csrfToken = getCsrfToken();

    // Fail fast if CSRF is missing
    if (!csrfToken) {
        setInfoSpan(ui, "Security Error: Missing CSRF Token. Please refresh the page.");
        return;
    }

    const headers = { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': csrfToken };

    resetPopups();
    setLoading(true);

    try {
        if (isPathRegister) {
            await register(email, headers);
        } else {
            await login(email, headers);
        }

    } catch (error) {
        console.error(error);
        if (error.name === 'NotAllowedError') {
            setInfoSpan(ui, "Setup cancelled. Try again when ready.", "warning");
        } else if (error.name === 'AbortError') {
            setInfoSpan(ui, "The operation was aborted. Try again.", "error");
        } else {
            setInfoSpan(ui, error.message || "An unexpected error occurred.", "error");
        }
    } finally {
        setLoading(ui, false);
    }
});


async function register(email, headers) {
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
        setInfoSpan(ui, base64url.encode(prfResult), "success");
        encryptionPayload = await webauthnService.createPayload(salt, prfResult);
    } else {
        setInfoSpan(ui, "Your device does not support secure encryption (PRF). Registration cancelled.", "error");
        throw new Error("Your device does not support secure encryption (PRF). Registration cancelled.");
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

    const credentialRecord = await fetch('/register', request);

    if (!credentialRecord.ok) {
        setInfoSpan(ui, credentialRecord.statusText || "An unexpected error occurred.", 'error');
        return;
    }
    setInfoSpan("Account created successfully! Redirecting to login page...", "success");
    setTimeout(() => window.location.href = '/login', 2000);
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

    const credentialRecord = await webauthnService.login('/login', headers, assertionResponse);

    console.log(credentialRecord);

    if (!credentialRecord.ok) {
        setInfoSpan(credentialRecord.statusText || "An unexpected error occurred.", 'error');
        return;
    }

    setInfoSpan("Loged in successfully! Redirecting...", "success");
    setTimeout(() => window.location.href = '/dashboard', 2500);

}

ui.emailInput.addEventListener('input', () => {
    ui.submitBtn.disabled = !ui.emailInput.checkValidity() && hasPrf;
});