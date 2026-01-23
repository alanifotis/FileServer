(() => {
    'use strict';

    function render() {
        const path = window.location.pathname.replace(/\/$/, ""); 
        const isPathRegister = path === '/register';

        const View = {
            headerTemplateId: isPathRegister ? 'register-header-template' : 'login-header-template',
            footerTemplateId: isPathRegister ? 'register-footer-template' : 'login-footer-template',
            buttonText: isPathRegister ? "Register" : "Sign In",
            autocomplete: isPathRegister ? 'username' : 'username webauthn',
            title: isPathRegister ? 'Register' : 'Sign In',
        };

        const ui = {
            emailInput: document.getElementById('email'),
            headerContainer: document.getElementById('headerHTML'),
            footerContainer: document.getElementById('footerHTML'),
            buttonText: document.querySelector('.btn-text'),
            title: document.querySelector('title'),
            myself: document.getElementById('viewSrc'),
        };

        if (!ui.emailInput || !ui.headerContainer || !ui.footerContainer) {
            console.warn("Critical DOM elements missing, aborting render.");
            return;
        }

        ui.emailInput.autocomplete = View.autocomplete;
        ui.buttonText.textContent = View.buttonText;
        ui.title.textContent = View.title;

        const swapTemplate = (container, tplId) => {
            const tpl = document.getElementById(tplId);
            if (tpl) {
                container.replaceChildren(tpl.content.cloneNode(true));
            }
        };

        swapTemplate(ui.headerContainer, View.headerTemplateId);
        swapTemplate(ui.footerContainer, View.footerTemplateId);

        document.removeEventListener('DOMContentLoaded', render);

        if (ui.myself) {
            ui.myself.remove();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }

})();