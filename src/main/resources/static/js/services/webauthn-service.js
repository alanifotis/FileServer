import base64url from "../utils/base64url.js";
import http from "../utils/http.js";
import abortController from "../utils/abort-controller.js";

/**
 * Checks if the browser/device supports the specific encryption (PRF) feature we need.
 * Used to warn users early if their device doesn't support the feature.
 * @returns {boolean}
 */
async function checkPrfSupport() {

  const prf = await PublicKeyCredential.getClientCapabilities("public-key");
  const conditional = await window.PublicKeyCredential.isConditionalMediationAvailable();

  const prfSupport = !!(
    window.PublicKeyCredential &&
    window.PublicKeyCredential.isConditionalMediationAvailable &&
    conditional
    && (prf['extension:prf'])
  );

  console.log(prfSupport ? "Prf is supported by the browser." : "This browser isn't supported.")

  return prfSupport;

}

/**
 * Get Public Key Registration Options.
 * @param {string} email required for account creation.
 * @param {string} endpoint required backend endpoint.
 * @param {Headers} headers necessary to complete the HTTP request.
 * 
 * @returns {Promise<PublicKeyCredentialCreationOptions> | Promise<Error>} 
 */

async function getRegistrationOptions(headers, endpoint, email) {

  const response = await http.post(endpoint, headers, email);;

        if (!response.ok) {
            const errorMsg = await response.text().catch(() => "Unknown Server Error");
            throw new HttpError(response.status, errorMsg);
        }
        
        const options = await response.json();

        return PublicKeyCredential.parseCreationOptionsFromJSON(options);
}

async function getLoginOptions(headers, endpoint, email) {
  try {
    let response = await http.post(endpoint, headers, email);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}\n ${response.text().then((text) => {
        console.error(`Server Message: ${text}`);
      })}`);
    }

    response = await response.json();

    const options = PublicKeyCredential.parseRequestOptionsFromJSON(response.options);

    return { options: options, authContexts: response.authContexts };

  } catch (err) {
    throw new Error(`Failed to fetch options: ${err.message}`, { cause: err });
  }
}

/**
 * Create the passkey.
 */
async function createPasskey(options) {

  const credential = await navigator.credentials.create({
    publicKey: options,
    signal: abortController.newSignal(),
  })

  if (!credential) {
    throw new DOMException("Operation aborted.", "AbortError");
  }

  return credential.toJSON();
}

async function createPrfSecretKey(extResults, rawId, salt) {
  // 1. Try to get the key from the Registration result (Works for USB keys, fails for Phones)
  if (extResults.prf && extResults.prf.results && extResults.prf.results.first) {
    console.log("Got PRF key during registration!");
    return extResults.prf.results.first;
  }
  // 2. If missing, but PRF is enabled, we must fetch it manually (The Fix for Phones)
  else if (extResults.prf && extResults.prf.enabled) {
    console.log("PRF enabled but key missing. Performing silent fetch...");

    // Immediately call .get() to retrieve the key
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [{
          id: rawId,
          type: 'public-key'
        }],
        extensions: {
          prf: {
            eval: {
              first: salt
            }
          }
        }
      }
    });

    const assertionResults = assertion.getClientExtensionResults();

    if (assertionResults.prf && assertionResults.prf.results) {
      return assertionResults.prf.results.first;
    }
  }
  return null;
}

async function createPayload(salt, prfResult) {

  const masterKey = crypto.getRandomValues(new Uint8Array(32));

  const keyEncryptionKey = await crypto.subtle.importKey(
    "raw",
    prfResult,
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const wrappedKeyBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    keyEncryptionKey,
    masterKey
  );

  const payload = {
    prfContext: {
      salt: base64url.encode(salt),
      wrappedKey: base64url.encode(wrappedKeyBuffer),
      iv: base64url.encode(iv)
    }
  };

  return payload;
}

async function login(endpoint, headers, assertionCredetials) {
  try {
    let response = await http.post(endpoint, headers, assertionCredetials);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}\n ${response.text().then((text) => {
        console.error(`Server Message: ${text}`);
      })}`);
    }
    return response;

  } catch (err) {
    throw new Error(`Failed to fetch options: ${err.message}`, { cause: err });
  }
}

export default {
  checkPrfSupport,
  getRegistrationOptions,
  getLoginOptions,
  createPasskey,
  createPrfSecretKey,
  createPayload,
  login
};