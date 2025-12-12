document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedbackArea = document.getElementById('formFeedback');
    const emailInput = document.getElementById('email');

    // --- 0. Feature Detection ---
    if (!window.PublicKeyCredential) {
        showFeedback("Your device or browser does not support Passkeys.", "error");
        submitBtn.disabled = true;
        return; // Stop execution
    }

    // --- 1. WebAuthn Utilities ---
    const utils = {
        toBuffer: (txt) => {
            const base64 = txt.replace(/-/g, '+').replace(/_/g, '/');
            const padLen = (4 - (base64.length % 4)) % 4;
            const padded = base64.padEnd(base64.length + padLen, '=');
            const binary = atob(padded);
            const buffer = new ArrayBuffer(binary.length);
            const bytes = new Uint8Array(buffer);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            return buffer;
        },
        toBase64Url: (buffer) => {
            const bytes = new Uint8Array(buffer);
            let binary = '';
            for (const byte of bytes) binary += String.fromCharCode(byte);
            return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
    };

    // --- 2. Helpers ---
    function getCsrfToken() {
        const name = 'XSRF-TOKEN=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return '';
    }

    // Helper to parse server errors cleanly
    async function handleServerResponse(response) {
        if (!response.ok) {
            let errorMessage = 'An unknown error occurred.';
            try {
                // Try to parse the JSON error message from the server
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Fallback if response isn't JSON
                errorMessage = response.statusText;
            }
            throw new Error(errorMessage);
        }
        return response.json();
    }

    function setLoading(isLoading) {
        // We only disable here. Re-enabling is handled in the 'finally' block 
        // to check validation status first.
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.querySelector('.spinner').classList.remove('hidden');
            submitBtn.querySelector('.btn-text').textContent = 'Waiting for device...';
        } else {
            submitBtn.querySelector('.spinner').classList.add('hidden');
            submitBtn.querySelector('.btn-text').textContent = 'Create Passkey';
        }
    }

    function showFeedback(message, type) {
        feedbackArea.textContent = message;
        // Reset classes and add new ones
        feedbackArea.className = 'form-feedback'; 
        feedbackArea.classList.add(type); // 'error', 'success', or 'warning'
        feedbackArea.classList.remove('hidden');
    }

    // --- 3. Main Logic ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedbackArea.classList.add('hidden');
        
        // Double check validation on submit
        if (!emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }

        const email = emailInput.value;
        setLoading(true);

        try {
            const headers = { 
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken() 
            };

            // Step A: Get Options
            const optResp = await fetch('/webauthn/register/options', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ username: email })
            });
            const optionsJson = await handleServerResponse(optResp);

            // Step B: Decode
            optionsJson.challenge = utils.toBuffer(optionsJson.challenge);
            optionsJson.user.id = utils.toBuffer(optionsJson.user.id);
            if (optionsJson.excludeCredentials) {
                optionsJson.excludeCredentials.forEach(cred => cred.id = utils.toBuffer(cred.id));
            }

            // Step C: Create Credentials (Browser Prompt)
            // This is where the user might click "Cancel"
            const credential = await navigator.credentials.create({ publicKey: optionsJson });

            // Step D: Encode Response
            const publicKeyCredential = {
                id: credential.id,
                type: credential.type,
                rawId: utils.toBase64Url(credential.rawId),
                response: {
                    attestationObject: utils.toBase64Url(credential.response.attestationObject),
                    clientDataJSON: utils.toBase64Url(credential.response.clientDataJSON)
                },
                clientExtensionResults: credential.getClientExtensionResults() 
            };

            // Step E: Verify with Server
            const finishResp = await fetch('/webauthn/register', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(publicKeyCredential)
            });
            await handleServerResponse(finishResp);

            // Success!
            showFeedback('Passkey registered! Redirecting...', 'success');
            setTimeout(() => window.location.href = '/login', 2000);

        } catch (error) {
            console.error(error);
            
            // --- Improved Error Handling ---
            if (error.name === 'NotAllowedError') {
                // User clicked "Cancel" in the browser dialog
                showFeedback('Setup cancelled. Try again when ready.', 'warning');
            } else if (error.name === 'InvalidStateError') {
                // The user already has a passkey for this device
                showFeedback('This device is already registered for this account.', 'error');
            } else if (error.name === 'SecurityError') {
                 // Often happens if site is not HTTPS or localhost
                showFeedback('Security Error: Passkeys require HTTPS.', 'error');
            } else {
                // Server error or other unknown error
                showFeedback(error.message || 'Registration failed.', 'error');
            }

        } finally {
            setLoading(false);
            // Restore button state based on current input validity
            submitBtn.disabled = !emailInput.checkValidity();
        }
    });

    // --- 4. Live Validation Listener ---
    emailInput.addEventListener('input', () => {
        submitBtn.disabled = !emailInput.checkValidity();
    });
});