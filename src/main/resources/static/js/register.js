document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedbackArea = document.getElementById('formFeedback');

    // --- WebAuthn Utilities (Base64URL <-> ArrayBuffer) ---
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

    // --- CSRF Helper ---
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

    // --- UI Helpers ---
    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        submitBtn.querySelector('.spinner').classList.toggle('hidden', !isLoading);
        submitBtn.querySelector('.btn-text').textContent = isLoading ? 'Waiting for device...' : 'Register Passkey';
    }

    function showFeedback(message, type) {
        feedbackArea.textContent = message;
        feedbackArea.className = `form-feedback ${type}`;
        feedbackArea.classList.remove('hidden');
    }

    // --- Main Registration Logic ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedbackArea.classList.add('hidden');
        
        const email = document.getElementById('email').value;
        if (!email) return;

        setLoading(true);

        try {
            const csrfToken = getCsrfToken();
            const headers = { 
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken 
            };

            // 1. Request Creation Options from Server
            // You need a backend controller that handles this path
            const optResp = await fetch('/webauthn/register/options', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ username: email })
            });

            if (!optResp.ok) throw new Error('Failed to start registration.');
            const optionsJson = await optResp.json();

            // 2. Decode Options for the Browser
            // The server sends Base64 strings, browser needs ArrayBuffers
            optionsJson.challenge = utils.toBuffer(optionsJson.challenge);
            optionsJson.user.id = utils.toBuffer(optionsJson.user.id);
            if (optionsJson.excludeCredentials) {
                optionsJson.excludeCredentials.forEach(cred => cred.id = utils.toBuffer(cred.id));
            }

            // 3. Create Credentials (The Browser Popup)
            const credential = await navigator.credentials.create({ publicKey: optionsJson });

            // 4. Encode Response to send back to Server
            // Browser gives ArrayBuffers, server wants Base64 strings
            const publicKeyCredential = {
                id: credential.id,
                type: credential.type,
                rawId: utils.toBase64Url(credential.rawId),
                response: {
                    attestationObject: utils.toBase64Url(credential.response.attestationObject),
                    clientDataJSON: utils.toBase64Url(credential.response.clientDataJSON)
                },
                // Pass back the username/email context if your server is stateless regarding the flow
                clientExtensionResults: credential.getClientExtensionResults() 
            };

            // 5. Finalize Registration
            const finishResp = await fetch('/webauthn/register', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(publicKeyCredential)
            });

            if (finishResp.ok) {
                showFeedback('Passkey registered! Redirecting...', 'success');
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                throw new Error('Server rejected the passkey.');
            }

        } catch (error) {
            console.error(error);
            showFeedback(error.message || 'Registration failed.', 'error');
        } finally {
            setLoading(false);
        }
    });
});