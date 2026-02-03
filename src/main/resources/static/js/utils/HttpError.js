import isPathRegister from "../auth-controller.js";

class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
    }
}

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
    resetPopups();
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

/**
 * Specialized Error Handler based on web.dev Passkey guidelines
 * Balances technical accuracy with user-friendly messages.
 */
function handlePasskeyError(error) {
    console.error("Passkey Error Debug:", error); // Keep internal state in console only

    // 1. HANDLE BROWSER/WEBAUTHN ERRORS (DOMException)
    // Ref: https://web.dev/articles/passkey#error-handling
    if (error.name === 'NotAllowedError') {
        // UX: This is the most common error. It means the user clicked "Cancel", 
        // the biometric check failed, or the user didn't select a key in time.
        // It is NOT a system failure, so use 'warning', not 'error'.
        setInfoSpan("Login cancelled or timed out. Please try again.", "warning");
    } 
    else if (error.name === 'SecurityError') {
        // UX: This usually happens during development (http vs https) or bad RP ID config.
        // The user cannot fix this.
        setInfoSpan("A security configuration issue prevented access.", "error");
    }
    else if (error.name === 'AbortError') {
        // UX: The signal was aborted (timeout or manual cancellation).
        setInfoSpan("The login process was interrupted.", "warning");
    }
    else if (error.name === 'NotSupportedError') {
        // UX: The device doesn't support the required encryption or passkeys.
        setInfoSpan("This device does not support the required security features.", "error");
    }
    else if (error.name === 'UnknownError') {
        // UX: Transient internal browser error.
        setInfoSpan("A temporary browser error occurred. Please refresh and try again.", "error");
    }
    
    // 2. HANDLE NETWORK/HTTP ERRORS
    else if (error instanceof HttpError) {
        if (error.status === 401 || error.status === 403) {
            setInfoSpan("We couldn't recognize that Passkey. Please try another.", "error");
        } else if (error.status >= 500) {
            setInfoSpan("Our service is momentarily unavailable. Please try again later.", "error");
        } else {
            setInfoSpan("Connection error. Please check your network.", "error");
        }
    }
    
    // 3. HANDLE GENERIC/PARSING ERRORS
    else {
        // Fallback for JSON parsing errors or unexpected logic bugs
        setInfoSpan("An unexpected error occurred. Please refresh the page.", "error");
    }
}

export default {
    HttpError,
    handlePasskeyError,
    ui,
    setInfoSpan,
    setLoading,
    setVisibility,
    resetPopups
}