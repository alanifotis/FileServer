package home.fileserver.dto;

import java.util.Collections;
import java.util.Set;

import org.jspecify.annotations.Nullable;
import org.springframework.security.web.webauthn.api.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 1. ROOT LEVEL
 * Matches: "email", "label", "credentials"
 */
public record RegistrationRequest(
    String email,
    String label,
    CredentialsDto credentials 
) {

    /**
     * 2. CREDENTIALS LEVEL
     * Matches: "id", "rawId", "type", "authenticatorAttachment", "response", "clientExtensionResults"
     */
    public record CredentialsDto(
        String id,
        String rawId,
        String type,
        String authenticatorAttachment,
        ResponseDto response,
        ExtensionResultsDto clientExtensionResults
    ) {}

    /**
     * 3. RESPONSE LEVEL
     * Matches: "attestationObject", "clientDataJSON", "transports", etc.
     */
    
    public record ResponseDto(
        String attestationObject,
        String clientDataJSON,
        String authenticatorData, // Extra field sent by Android
        String publicKey,         // Extra field sent by Android
        Integer publicKeyAlgorithm, // Extra field sent by Android
        Set<String> transports 
    ) {}

    /**
     * 4. EXTENSIONS LEVEL
     * Matches: "prf"
     */
    
    public record ExtensionResultsDto(
        PrfDto prf,
        @Nullable AuthenticationExtensionsClientOutput<CredentialPropertiesOutput> credProps
    ) {
        
        public record PrfDto(
            boolean enabled
        ) {}
    }

    // --- CONVERSION LOGIC ---

    public PublicKeyCredential<AuthenticatorAttestationResponse> toPublicKeyCredential() {
        if (credentials == null) {
            throw new IllegalArgumentException("Credentials cannot be null");
        }

        // A. Type-Safe Extension Parsing
        List<AuthenticationExtensionsClientOutput<?>> outputList = new ArrayList<>();
        
        if (credentials.clientExtensionResults != null && credentials.clientExtensionResults.prf != null) {
            boolean prfEnabled = credentials.clientExtensionResults.prf.enabled;
            // Use your custom AndroidPrfResponse class here
            outputList.add(new AndroidPrfResponse(prfEnabled));
        }

        List<AuthenticatorTransport> tr = Collections.emptyList();

        if (credentials.response.transports != null) {
            
        }

        for (var transport : credentials.response.transports) {
            tr.add(AuthenticatorTransport.valueOf(transport));
        }

        // B. Type-Safe Response Parsing
        AuthenticatorAttestationResponse attestationResponse = AuthenticatorAttestationResponse.builder()
                .attestationObject(Bytes.fromBase64(credentials.response.attestationObject))
                .clientDataJSON(Bytes.fromBase64(credentials.response.clientDataJSON))
                .transports(tr)
                .build();

        // C. Build Final Object
        // Using 'var builder' prevents the "Raw Type" chaining error
        var builder = PublicKeyCredential.<AuthenticatorAttestationResponse>builder();

        builder.id(credentials.id);
        builder.rawId(Bytes.fromBase64(credentials.rawId));
        builder.type(PublicKeyCredentialType.PUBLIC_KEY);
        
        if (credentials.authenticatorAttachment != null) {
            builder.authenticatorAttachment(AuthenticatorAttachment.valueOf(credentials.authenticatorAttachment.toUpperCase()));
        }

        builder.response(attestationResponse);
        builder.clientExtensionResults(new ImmutableAuthenticationExtensionsClientOutputs(outputList));

        return builder.build();
    }
}