import webauthnService from "./services/webauthn-service.js";
import http from "./utils/http.js"; 

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

        const headers = { 'X-XSRF-TOKEN': csrfToken };
        
        resetPopups(ui);
        setLoading(ui, true);

        try {
            // Step A: Get Options
            // We use the email to identify the user
            const options = await webauthnService.getRegistrationOptions(
                headers, 
                '/register/start' 
            );

            // Step B: The Dance
            const credential = await webauthnService.createPasskey(options);

            // Step C: Send to Custom Endpoint
            const payload = {
                email: email,
                credential: {
                    id: credential.id,
                    rawId: credential.rawId,
                    type: credential.type,
                    response: credential.response,
                    clientExtensionResults: credential.clientExtensionResults,
                    authenticatorAttachment: credential.authenticatorAttachment
                },
                label: "My Passkey"
            };

            const response = await http.post('/register', headers, payload);
            
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || "Registration failed");
            }

            // Success
            setSuccess(ui, "Account created successfully! Redirecting...");
            setTimeout(() => window.location.href = '/login', 2000);

        } catch (error) {
            console.error(error);
            if (error.name === 'NotAllowedError') {
                setError(ui, "Setup cancelled.");
            } else {
                setError(ui, error.message || "An unexpected error occurred.");
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