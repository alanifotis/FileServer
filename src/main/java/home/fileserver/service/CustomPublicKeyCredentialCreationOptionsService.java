package home.fileserver.service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.security.web.webauthn.registration.PublicKeyCredentialCreationOptionsRepository;
import org.springframework.security.web.webauthn.api.AuthenticatorAttachment;
import org.springframework.stereotype.Service;


import home.fileserver.dto.PasskeyRegistrationRequestDto;
import home.fileserver.models.AuthenticationExtensionsCredProps;
import home.fileserver.models.AuthenticationExtensionsPrfInputs;
import home.fileserver.models.AuthenticationExtensionsPrfInputs.PrfValues;
import home.fileserver.utilities.Longs;
import home.fileserver.utilities.Snowflake;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomPublicKeyCredentialCreationOptionsService {
        @Value("${fileserver.PublicKeyCredentialRpEntity.name}")
        private String rpEntityName;
        @Value("${fileserver.PublicKeyCredentialRpEntity.id}")
        private String rpEntityId;
        private final PublicKeyCredentialCreationOptionsRepository creationOptionsRepository;
        private final Snowflake snowflake;

        public PublicKeyCredentialCreationOptions getPublicKeyCredentialCreationOptions(
                        @NonNull PasskeyRegistrationRequestDto dto,
                        HttpServletRequest request,
                        HttpServletResponse response) {
                byte[] userId = Longs.toByteArray(snowflake.nextId());
                Bytes challenge = Bytes.random();
                PublicKeyCredentialRpEntity rp = PublicKeyCredentialRpEntity
                                .builder()
                                .id(rpEntityId)
                                .name(rpEntityName)
                                .build();
                PublicKeyCredentialUserEntity user = ImmutablePublicKeyCredentialUserEntity.builder()
                                .id(new Bytes(userId))
                                .displayName(dto.email().substring(0, dto.email().indexOf('@')))
                                .name(dto.email())
                                .build();

                // Ed25519 (Preferred modern)
                // ES256 (Universal fallback)
                // RS256 (Legacy fallback)
                // ES256 -7 SHA-256 ECDSA w/ SHA-256
                // ES384 -35 SHA-384 ECDSA w/ SHA-384
                // ES512 -36 SHA-512 ECDSA w/ SHA-512
                List<PublicKeyCredentialParameters> publicKeyCredentialParameters = new ArrayList<PublicKeyCredentialParameters>(
                                List.of(
                                                PublicKeyCredentialParameters.EdDSA,
                                                PublicKeyCredentialParameters.ES256,
                                                PublicKeyCredentialParameters.ES384,
                                                PublicKeyCredentialParameters.ES512,
                                                PublicKeyCredentialParameters.RS256));

                Duration timeout = Duration.ofMillis(300000L);

                List<PublicKeyCredentialDescriptor> excludeCredentials = Collections.emptyList();

                AuthenticatorAttachment authenticatorAttachment = null;

                if (dto.userAgent().contains("Linux") || dto.userAgent().contains("Windows")) {
                        authenticatorAttachment = AuthenticatorAttachment.CROSS_PLATFORM;
                }

                AuthenticatorSelectionCriteria authenticatorSelection = AuthenticatorSelectionCriteria.builder()
                                .authenticatorAttachment(authenticatorAttachment)
                                .residentKey(ResidentKeyRequirement.REQUIRED)
                                .userVerification(UserVerificationRequirement.REQUIRED)
                                .build();

                AttestationConveyancePreference attestation = AttestationConveyancePreference.NONE;

                AuthenticationExtensionsPrfInputs prfInput = new AuthenticationExtensionsPrfInputs();

                prfInput.setEval(new PrfValues(Bytes.random()));

                // Create the Extension object
                AuthenticationExtensionsClientInput<AuthenticationExtensionsPrfInputs> prfExtension = new ImmutableAuthenticationExtensionsClientInput<>(
                                "prf", prfInput);

                AuthenticationExtensionsClientInput<AuthenticationExtensionsCredProps> credProps = new ImmutableAuthenticationExtensionsClientInput<>(
                                "credProp", new AuthenticationExtensionsCredProps(true));

                // Add to the list
                AuthenticationExtensionsClientInputs extensions = new ImmutableAuthenticationExtensionsClientInputs(
                                List.of(credProps, prfExtension));

                PublicKeyCredentialCreationOptions options = PublicKeyCredentialCreationOptions.builder()
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

                this.creationOptionsRepository.save(request, response, options);
                return options;
        }

}
