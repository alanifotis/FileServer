package home.fileserver.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.jspecify.annotations.Nullable;
import org.springframework.security.web.webauthn.api.*;

import home.fileserver.models.PlanTier;
import home.fileserver.models.User;

/**
 * 1. ROOT LEVEL
 * Matches: "email", "credentials", "salt", "wrappedKey", "iv"
 */
public record RegistrationRequest(
        String email,
        CredentialsDto credentials,
        PrfContext prfContext
    ) {

    /**
     * 2. CREDENTIALS LEVEL
     * Matches: "id", "rawId", "type", "authenticatorAttachment", "response",
     * "clientExtensionResults"
     */
    public record CredentialsDto(
            String id,
            String rawId,
            String type,
            String authenticatorAttachment,
            AuthenticatorAttestationResponse response,
            ExtensionResultsDto clientExtensionResults) {
    }

    public record PrfContext(String salt, String wrappedKey, String iv) {}

    /**
     * 3. RESPONSE LEVEL
     * Matches: "attestationObject", "clientDataJSON", "transports", etc.
     */

    public record ResponseDto(
            String attestationObject,
            String clientDataJSON,
            String authenticatorData, // Extra field sent by Android
            String publicKey, // Extra field sent by Android
            Integer publicKeyAlgorithm, // Extra field sent by Android
            Set<String> transports) {
    }

    /**
     * 4. EXTENSIONS LEVEL
     * Matches: "prf"
     */

    public record ExtensionResultsDto(
            PrfClientOutput prf,
            @Nullable CredentialPropertiesOutput credProps) {

        // public record PrfDto(
        // boolean enabled,
        // Results results) {
        // }
    }

    // --- CONVERSION LOGIC ---

    public PublicKeyCredential<AuthenticatorAttestationResponse> toPublicKeyCredential() {
        if (credentials == null) {
            throw new IllegalArgumentException("Credentials cannot be null");
        }

        // A. Type-Safe Extension Parsing
        List<AuthenticationExtensionsClientOutput<?>> outputList = new ArrayList<>();

        if (credentials.clientExtensionResults != null && credentials.clientExtensionResults.prf != null) {
            // boolean prfEnabled =
            // credentials.clientExtensionResults.prf.getOutput().getEnabled();
            // Results results =
            // credentials.clientExtensionResults.prf.getOutput().getResults();
            // Use your custom AndroidPrfResponse class here
            outputList.add(credentials.clientExtensionResults.prf);
        }

        if (credentials.clientExtensionResults != null && credentials.clientExtensionResults.credProps != null) {
            outputList.add(credentials.clientExtensionResults.credProps);
        }

        // List<AuthenticatorTransport> tr = new ArrayList<>();

        // if (credentials.response..transports != null) {
        // for (var transport : credentials.response.transports) {
        // tr.add(AuthenticatorTransport.valueOf(transport));
        // }
        // }

        // // B. Type-Safe Response Parsing
        // AuthenticatorAttestationResponse attestationResponse =
        // AuthenticatorAttestationResponse.builder()
        // .attestationObject(Bytes.fromBase64(credentials.response.attestationObject))
        // .clientDataJSON(Bytes.fromBase64(credentials.response.clientDataJSON))
        // .transports(tr)
        // .build();

        // C. Build Final Object
        // Using 'var builder' prevents the "Raw Type" chaining error
        var builder = PublicKeyCredential.<AuthenticatorAttestationResponse>builder();

        builder.id(credentials.id);
        builder.rawId(Bytes.fromBase64(credentials.rawId));
        builder.type(PublicKeyCredentialType.PUBLIC_KEY);

        if (credentials.authenticatorAttachment != null) {
            builder.authenticatorAttachment(
                    AuthenticatorAttachment.valueOf(credentials.authenticatorAttachment.toUpperCase()));
        }

        builder.response(credentials.response);
        builder.clientExtensionResults(new ImmutableAuthenticationExtensionsClientOutputs(outputList));

        return builder.build();
    }

    public String getDisplayName(String email) {
        return this.email().substring(0, this.email().indexOf('@'));
    }

    public User toUser(long id, String email) {
        return User.builder()
                .id(id)
                .role("USER")
                .email(email)
                .displayName(this.getDisplayName(email))
                .planTier(PlanTier.FREE)
                .locale("en-US")
                .build();
    }
}