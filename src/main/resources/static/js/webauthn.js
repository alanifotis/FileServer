"use strict";

/**
 * Check if the Client device supports the PRF extension.
 * 
 * See more: https://github.com/w3c/webauthn/wiki/Explainer:-PRF-extension
 * @returns {boolean}
 */

export async function checkPrfSupport() {
    if (window.PublicKeyCredential &&
        typeof PublicKeyCredential.getClientCapabilities === 'function') {
        const caps = await PublicKeyCredential.getClientCapabilities("public-key");
        if (caps.extensions?.includes("prf")) {
            console.log("This browser supports the PRF extension.");
            return true;
        }
    }
    return false;
}