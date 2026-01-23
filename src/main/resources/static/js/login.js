
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

    const assertionOptions = await fetch('/automagic', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() }
    }).then(async (response) => {
        // FIX 1: Await the JSON body
        const data = await response.json();
        // FIX 2: Now pass the actual data to the parser
        return PublicKeyCredential.parseRequestOptionsFromJSON(data);
    });

    // 1. Get the Raw Credential
    const credential = await navigator.credentials.get({
        publicKey: assertionOptions,
        signal: abortController.newSignal(),
        mediation: 'conditional'
    });


    const attResponse = credential.toJSON();

    const autoLogin = await fetch('/automagic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCsrfToken()
        },
        body: JSON.stringify(attResponse)
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Server returned ' + response.status);
    }).then(data => {
        console.log("Login Success!", data);
    }).catch(e => {
        console.error("Login Failed:", e);
    });

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