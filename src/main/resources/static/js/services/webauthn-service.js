import base64url from "../utils/base64url.js";
import http from "../utils/http.js";
import abortController from "../utils/abort-controller.js";

/**
 * Checks if the browser/device supports the specific encryption (PRF) feature we need.
 * Used to warn users early if their device is too old.
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
 * Step 1: Get Options
 */
async function getRegistrationOptions(headers, endpoint, email) {
  try {
    const response = await http.post(endpoint, headers, email);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}\n ${response.text().then((text) => {
        console.error(`Server Message: ${text}`);
      })}`);

    }
    const options = await response.json();

    console.warn(options);

    const decodedExcludeCredentials = !options.excludeCredentials
      ? []
      : options.excludeCredentials.map((cred) => ({
        ...cred,
        id: base64url.decode(cred.id),
      }));

    return {
      ...options,
      user: {
        ...options.user,
        id: base64url.decode(options.user.id),
      },
      challenge: base64url.decode(options.challenge),
      excludeCredentials: decodedExcludeCredentials,
    };
  } catch (err) {
    throw new Error(`Failed to fetch options: ${err.message}`, { cause: err });
  }
}

/**
 * Step 2: Create Passkey with PRF enabled
 */
async function createPasskey(options) {
  // Ensure PRF is requested
  if (!options.extensions) { options.extensions = {}; }
  options.extensions.prf = {};

  let credential;
  try {
    credential = await navigator.credentials.create({
      publicKey: options,
      signal: abortController.newSignal(),
    });
  } catch (err) {
    throw err;
  }

  const extensions = credential.getClientExtensionResults();
  const prfEnabled = !!(extensions.prf && extensions.prf.enabled);

  return {
    id: credential.id,
    type: credential.type,
    rawId: base64url.encode(credential.rawId),
    response: {
      attestationObject: base64url.encode(credential.response.attestationObject),
      clientDataJSON: base64url.encode(credential.response.clientDataJSON),
      transports: credential.response.getTransports ? credential.response.getTransports() : [],
    },
    clientExtensionResults: extensions,
    authenticatorAttachment: credential.authenticatorAttachment,
    isEncryptionSupported: prfEnabled
  };
}

export default {
  checkPrfSupport,
  getRegistrationOptions,
  createPasskey
};