package home.fileserver.dto;

import java.util.ArrayList;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.security.web.webauthn.api.*;

import home.fileserver.models.User;

/**
 * 1. ROOT LEVEL
 * Matches: "email", "credentials", "prfContext"
 */
public record RegistrationRequest(
        String email,
        CredentialsDto credentials,
        PrfContext prfContext) {

    public record CredentialsDto(
            String id,
            String rawId,
            String type,
            String authenticatorAttachment,
            AuthenticatorAttestationResponse response,
            ExtensionResultsDto clientExtensionResults) {
    }

    public record PrfContext(String salt, String wrappedKey, String iv) {
    }


    public record ExtensionResultsDto(
            PrfClientOutput prf,
            @Nullable CredentialPropertiesOutput credProps) {
    }

    // --- CONVERSION LOGIC ---

    public PublicKeyCredential<AuthenticatorAttestationResponse> toPublicKeyCredential() {
        if (credentials == null) {
            throw new IllegalArgumentException("Credentials cannot be null");
        }

        List<AuthenticationExtensionsClientOutput<?>> outputList = new ArrayList<>();

        if (credentials.clientExtensionResults != null && credentials.clientExtensionResults.prf != null) {
            outputList.add(credentials.clientExtensionResults.prf);
        }

        if (credentials.clientExtensionResults != null && credentials.clientExtensionResults.credProps != null) {
            outputList.add(credentials.clientExtensionResults.credProps);
        }

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
                .email(email)                
                .displayName(this.getDisplayName(email))
                .build();
    }
}