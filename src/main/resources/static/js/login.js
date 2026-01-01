import webauthnService from "./services/webauthn-service.js";
import http from "./utils/http.js";
import abortController from "./utils/abort-controller.js";
import base64url from "./utils/base64url.js";


const regex = /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/;

/**  --- UI Helper Functions (The "View" Layer) ---
 * 
 * Based on the pattern from webauthn-registration.js
 * 
 * @param {HTMLElement} element The HTML UI element
 * @param {Boolean} isVisible Visibility toggle
 * @param {String} level - CSS class name can be warning, error or success.
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

function resetPopups(ui) {
    setVisibility(ui.successArea, false);
    setVisibility(ui.errorArea, false);
    ui.successArea.textContent = '';
    ui.errorArea.textContent = '';
}

function setError(ui, msg, level) {
    resetPopups(ui);
    if (!ui.errorArea) return;
    ui.errorArea.textContent = msg;
    setVisibility(ui.errorArea, true, level);
}

function setSuccess(ui, msg) {
    resetPopups(ui);
    if (!ui.successArea) return;
    ui.successArea.textContent = msg;
    setVisibility(ui.successArea, true);
}

function setLoading(ui, isLoading) {
    ui.submitBtn.disabled = isLoading;
    if (isLoading) {
        ui.submitBtn.querySelector('.btn-text').textContent = 'Check your device...';
        ui.spinner.classList.remove('hidden');
    } else {
        ui.submitBtn.querySelector('.btn-text').textContent = 'Create Passkey';
        ui.spinner.classList.add('hidden');
    }
}

// --- Main Controller Logic ---
document.addEventListener('DOMContentLoaded', async () => {

    // 1. Define the UI Object
    // This creates a single source of truth for all DOM elements
    const ui = {
        form: document.getElementById('registerForm'),
        submitBtn: document.getElementById('submitBtn'),
        emailInput: document.getElementById('email'),
        // We assume you have split your feedback area into two divs in HTML for better styling,
        // or we map them to the same one if you prefer.
        errorArea: document.getElementById('formFeedback'),
        successArea: document.getElementById('formFeedback'), // Reusing the same div for now
        spinner: document.querySelector('.spinner')
    };

    // 2. Capability Check (Run immediately)
    // We use your custom PRF check here
    const hasPrf = await webauthnService.checkPrfSupport();
    if (!hasPrf) {
        console.warn("PRF extension not supported.");
        setError(ui, "Notice: Your device may not support file encryption. You can still register, but features will be limited.", "warning");
        // We do NOT disable the button, we just warn.
    }

    // 3. Helper: Your Regex CSRF Extractor
    function getCsrfToken() {
        return document.cookie.replace(regex, '$1');
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
            setError(ui, "Security Error: Missing CSRF Token. Please refresh the page.");
            return;
        }

        const headers = { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': csrfToken };

        resetPopups(ui);
        setLoading(ui, true);

        try {
            // Step A: Get Options
            // We use the email to identify the user
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

            // const useConditionalMediation = await webauthnService.checkPrfSupport();

            // if (useConditionalMediation) {
            //     console.log(useConditionalMediation);
            //     // Request a conditional UI
            //     credentialOptions.mediation = "conditional";
            // }

            console.log(credentialOptions);



            const assertionResponse = await navigator.credentials.get(credentialOptions);

            await webauthnService.login('/login', headers, assertionResponse);

            console.log(assertionResponse, base64url.encode(assertionResponse.getClientExtensionResults().prf.results.first));

            const auth = loginOptions.authContexts[assertionResponse.id];

            console.log(auth);

            const keyEncryptionKey = await crypto.subtle.importKey(
                "raw",
                assertionResponse.getClientExtensionResults().prf.results.first,
                "AES-GCM",
                false,
                ["decrypt"]
            );

            const unwrappedKeyBuffer = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: auth.iv },
                keyEncryptionKey,
                auth.wrappedKey
            );

            console.log(base64url.encode(unwrappedKeyBuffer));




            // registrationOptions.extensions.prf.eval.first = salt;


            // const credentials = await webauthnService.createPasskey(registrationOptions);


            // const prfResult = await webauthnService.createPrfSecretKey(credentials.getClientExtensionResults(), credentials.rawId, salt);

            // let encryptionPayload = null;

            // if (prfResult) {
            //     setError(ui, base64url.encode(prfResult), "success");
            //     encryptionPayload = await webauthnService.createPayload(salt, prfResult);
            // } else {
            //     setError(ui, "Your device does not support secure encryption (PRF). Registration cancelled.", "error");
            //     throw new Error("Your device does not support secure encryption (PRF). Registration cancelled.");
            // }

            // const payload = {
            //     email: email,
            //     credentials: credentials,
            //     ...encryptionPayload
            // }


            // const request = {
            //     method: "POST",
            //     headers: {
            //         ...headers,
            //     },
            //     body: JSON.stringify(payload)
            // };

            // const credentialRecord = await fetch('/register', request);

            // if (!credentialRecord.ok) {
            //     setError(ui, credentialRecord.statusText, 'error');
            // }
            // Success
            // setSuccess(ui, "Account created successfully! Redirecting...");
            // setTimeout(() => window.location.href = '/login', 2000);

        } catch (error) {
            console.error(error);
            if (error.name === 'NotAllowedError') {
                setError(ui, "Setup cancelled.", "error");
            } else {
                setError(ui, error.message || "An unexpected error occurred.", "error");
            }
        } finally {
            setLoading(ui, false);
        }
    });

    // 5. Live Validation
    ui.emailInput.addEventListener('input', () => {
        ui.submitBtn.disabled = !ui.emailInput.checkValidity();
    });
});