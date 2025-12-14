package home.fileserver.service;

import com.webauthn4j.WebAuthnManager;
import com.webauthn4j.data.RegistrationRequest;
import home.fileserver.models.AppUser;
import home.fileserver.repositories.AppUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;

@Service
public class WebAuthnRegistrationService {

    private final AppUserRepository userRepository;
    private final WebAuthnManager webAuthnManager; // You can instantiate this as a Bean
    private final SecureRandom secureRandom = new SecureRandom();

    public WebAuthnRegistrationService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
        this.webAuthnManager = WebAuthnManager.createNonStrictWebAuthnManager();
    }

    public String generateRegistrationOptions(String email) {
        if (userRepository.findByEmail(email) != null) {
            throw new RuntimeException("User already exists");
        }

        // 1. Generate a random Challenge
        byte[] challengeBytes = new byte[32];
        secureRandom.nextBytes(challengeBytes);
        String challengeBase64 = Base64.getUrlEncoder().withoutPadding().encodeToString(challengeBytes);
        
        // 2. Generate User Handle (Random ID for the user)
        byte[] userHandle = new byte[16];
        secureRandom.nextBytes(userHandle);
        String userHandleBase64 = Base64.getUrlEncoder().withoutPadding().encodeToString(userHandle);

        // 3. Construct JSON (Manual construction gives us full control over PRF extension requests)
        // Note: In production, use a library like Jackson ObjectNode to build this safely.
        return """
            {
                "rp": { "name": "FileServer", "id": "localhost" },
                "user": {
                    "email": "%s",
                    "displayName": "%s",
                    "id": "%s"
                },
                "challenge": "%s",
                "pubKeyCredParams": [
                    { "type": "public-key", "alg": -7 },
                    { "type": "public-key", "alg": -257 }
                ],
                "timeout": 60000,
                "attestation": "none",
                "excludeCredentials": [],
                "authenticatorSelection": {
                    "residentKey": "preferred",
                    "userVerification": "required"
                },
                "extensions": {
                    "credProps": true,
                    "prf": {}
                }
            }
            """.formatted(email, email, userHandleBase64, challengeBase64);
    }

    @Transactional
    public void finishRegistration(RegistrationRequest request) {
        // 1. Create the new User Entity
        AppUser user = new AppUser();
        // Since we don't have the email in the final POST body, you might need to 
        // store the "pending registration" in a Cache/Session using the challenge as a key.
        // For simplicity here, assuming we pass it or retrieve it from session.
        // user.setUsername(...); 
        
        // 2. Generate the ZERO-KNOWLEDGE SALT
        byte[] prfSalt = new byte[32];
        secureRandom.nextBytes(prfSalt);
        user.setPrfSalt(prfSalt);

        // 3. Parse and Verify WebAuthn Response using WebAuthn4J
        
        // ... (Mapping DTO to WebAuthn4J objects omitted for brevity) ...
        // You would perform webAuthnManager.validate(...) here.

        // 4. Extract Public Key and Counter
        // AttestationObject -> AuthData -> CredentialPublicKey
        byte[] publicKeyBytes = request.getAttestationObject(); // Extracted from webauthn verification result
        // long counter = ...;

        // 5. Create Authenticator Entity
//        Authenticator auth = new Authenticator();
        // auth.setLabel(request.publicKey.label);
        // auth.setCredentialId(credData.id);
//        assert publicKeyBytes != null;
//        auth.setPublicKey(publicKeyBytes);
//        // auth.setCount(counter);
//        auth.setAaguid("00000000-0000-0000-0000-000000000000"); // or extracted value

        // 6. Save Everything
        // user.addAuthenticator(auth);
        userRepository.save(user);
    }
}