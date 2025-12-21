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
      extensions: {
        prf: {
          eval: {
            first: new TextEncoder().encode('FileServer')
          }
        }
      }
    };
  } catch (err) {
    throw new Error(`Failed to fetch options: ${err.message}`, { cause: err });
  }
}

/**
 * Step 2: Create Passkey with PRF enabled
 */
async function createPasskey(options) {

  let credentialsContainer;
  try {
    credentialsContainer = await navigator.credentials.create({
      publicKey: options,
      signal: abortController.newSignal(),
    });
  } catch (err) {
    throw err;
  }

  const { response } = credentialsContainer;

  const clientExtensionResults = credentialsContainer.getClientExtensionResults();
  if (clientExtensionResults.prf.enabled) {
    console.log(`Before: ${clientExtensionResults.prf.results.first}`)
    clientExtensionResults.prf.results.first = base64url.encode(clientExtensionResults.prf.results.first);
    console.log(`After: ${clientExtensionResults.prf.results.first}`)
  }

  const credential = {
    id: credentialsContainer.id,
    rawId: base64url.encode(credentialsContainer.rawId),
    response: {
      attestationObject: base64url.encode(response.attestationObject),
      clientDataJSON: base64url.encode(response.clientDataJSON),
      transports: response.getTransports ? response.getTransports() : [],
    },
    type: credentialsContainer.type,
    clientExtensionResults: clientExtensionResults,
    authenticatorAttachment: credentialsContainer.authenticatorAttachment,
  };

  return credential;
}

export default {
  checkPrfSupport,
  getRegistrationOptions,
  createPasskey
};