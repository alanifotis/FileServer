function createPolicy() {
    if (typeof window.trustedTypes === 'undefined') {
        window.trustedTypes = { createPolicy: (n, rules) => rules };
    }

    let policy;
    if (window.trustedTypes && window.trustedTypes.defaultPolicy) {
        policy = window.trustedTypes.defaultPolicy;
    } else if (window.trustedTypes) {
        policy = window.trustedTypes.createPolicy('default', {
            createScriptURL: (url) => {
                const resolvedUrl = new URL(url, window.location.origin);
                if (resolvedUrl.origin === window.location.origin &&
                    resolvedUrl.pathname.startsWith('/js/') &&
                    resolvedUrl.pathname.endsWith(".js")
                ) {
                    return resolvedUrl.pathname;
                }
                throw new Error(`Security Violation: ${url} is not an authorized script.`);
            },
            createHTML: (html) => { return html; }
        });
    }

    return policy;  
}

export default createPolicy
