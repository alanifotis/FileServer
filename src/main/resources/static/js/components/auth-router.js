const authRouterStyles = new CSSStyleSheet();

authRouterStyles.replaceSync(`:host { display: block; }
                            ::slotted([hidden]) { display: none !important; }`);


export class AuthRouter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [authRouterStyles];
        this.shadowRoot.innerHTML = `
        <slot name="header"></slot>
        <slot></slot> <slot name="footer"></slot>`;
    }

    connectedCallback() {
        this.#handleRoute();
        window.addEventListener('popstate', () => this.#handleRoute());
        
        // Intercept internal links
        this.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href').startsWith('/')) {
                const href = link.getAttribute('href');
                if (href === '/login' || href === '/register') {
                    e.preventDefault();
                    window.history.pushState({}, '', href);
                    this.#handleRoute();
                }
            }
        });
    }

    #handleRoute() {
        const path = window.location.pathname;
        const mode = path === '/register' ? 'register' : 'login';
        
        this.querySelectorAll('[slot]').forEach(el => {
            const slotName = el.getAttribute('slot');
            if (slotName.startsWith(mode)) {
                el.slot = slotName.split('-')[1];
                el.removeAttribute('hidden');
            } else if (slotName.includes('-')) {
                el.slot = 'none';
                el.setAttribute('hidden', '');
            }
        });

        // Step 2: Meta Updates
        document.title = mode === 'register' ? 'Create Account' : 'Sign In';

        // Step 3: Dynamic Script Initialization
        // This ensures the correct passkey logic is loaded for the current path
        import(`/js/${mode}.js`).then(m => {
            if (m.init) m.init();
        }).catch(err => console.error(`Failed to load /js/${mode}.js`, err));
    }
}
customElements.define('auth-router', AuthRouter);