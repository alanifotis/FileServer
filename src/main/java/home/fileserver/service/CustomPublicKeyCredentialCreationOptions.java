package home.fileserver.service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.jspecify.annotations.NonNull;
import org.springframework.security.web.webauthn.api.AttestationConveyancePreference;
import org.springframework.security.web.webauthn.api.AuthenticationExtensionsClientInput;
import org.springframework.security.web.webauthn.api.AuthenticationExtensionsClientInputs;
import org.springframework.security.web.webauthn.api.AuthenticatorSelectionCriteria;
import org.springframework.security.web.webauthn.api.Bytes;
import org.springframework.security.web.webauthn.api.ImmutableAuthenticationExtensionsClientInput;
import org.springframework.security.web.webauthn.api.ImmutableAuthenticationExtensionsClientInputs;
import org.springframework.security.web.webauthn.api.ImmutablePublicKeyCredentialUserEntity;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialCreationOptions;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialDescriptor;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialParameters;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialRpEntity;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialUserEntity;
import org.springframework.security.web.webauthn.api.ResidentKeyRequirement;
import org.springframework.security.web.webauthn.api.UserVerificationRequirement;
import org.springframework.stereotype.Service;

import home.fileserver.models.AuthenticationExtensionsPrfInputs;
import home.fileserver.models.AuthenticationExtensionsPrfInputs.PrfValues;

@Service
public class CustomPublicKeyCredentialCreationOptions {

    public PublicKeyCredentialCreationOptions getPublicKeyCredentialCreationOptions(@NonNull String email) {
        Bytes challenge = Bytes.random();
        PublicKeyCredentialRpEntity rp = PublicKeyCredentialRpEntity.builder().id("localhost").name("Home FileServer")
                .build();
        PublicKeyCredentialUserEntity user = ImmutablePublicKeyCredentialUserEntity.builder().id(Bytes.random())
                .displayName(email).name(email).build();

        List<PublicKeyCredentialParameters> publicKeyCredentialParameters = new ArrayList<PublicKeyCredentialParameters>(
                List.of(
                        PublicKeyCredentialParameters.EdDSA,
                        PublicKeyCredentialParameters.ES256,
                        PublicKeyCredentialParameters.ES384,
                        PublicKeyCredentialParameters.ES512,
                        PublicKeyCredentialParameters.RS256,
                        PublicKeyCredentialParameters.RS384,
                        PublicKeyCredentialParameters.RS512,
                        PublicKeyCredentialParameters.RS1));

        Duration timeout = Duration.ofMillis(450000L);

        List<PublicKeyCredentialDescriptor> excludeCredentials = Collections.emptyList();

        AuthenticatorSelectionCriteria authenticatorSelection = AuthenticatorSelectionCriteria.builder()
                .authenticatorAttachment(null)
                .residentKey(ResidentKeyRequirement.REQUIRED)
                .userVerification(UserVerificationRequirement.REQUIRED)
                .build();

        AttestationConveyancePreference attestation = AttestationConveyancePreference.NONE;

        AuthenticationExtensionsPrfInputs prfInput = new AuthenticationExtensionsPrfInputs();

        prfInput.setEval(new PrfValues(Bytes.random()));

        // Create the Extension object
        AuthenticationExtensionsClientInput<AuthenticationExtensionsPrfInputs> prfExtension = new ImmutableAuthenticationExtensionsClientInput<>(
                "prf", prfInput);

        // Add to the list
        AuthenticationExtensionsClientInputs extensions = new ImmutableAuthenticationExtensionsClientInputs(
                Collections.singletonList(prfExtension));

        return PublicKeyCredentialCreationOptions.builder()
                .challenge(challenge)
                .rp(rp)
                .user(user)
                .pubKeyCredParams(publicKeyCredentialParameters)
                .timeout(timeout)
                .attestation(attestation)
                .excludeCredentials(excludeCredentials)
                .authenticatorSelection(authenticatorSelection)
                .extensions(extensions)
                .build();
    }

}
