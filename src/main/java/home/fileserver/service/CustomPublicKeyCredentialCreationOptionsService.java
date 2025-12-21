package home.fileserver.service;

import home.fileserver.dto.PasskeyRegistrationRequestDto;
import home.fileserver.dto.RegistrationRequest;
import home.fileserver.models.CredPropsAuthenticationExtensionsClientInput;
import home.fileserver.models.PrfAuthenticationExtensionsClientInput;
import home.fileserver.repositories.AppUserRepository;
import home.fileserver.utilities.Longs;
import home.fileserver.utilities.Snowflake;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.web.webauthn.api.*;
import org.springframework.security.web.webauthn.management.ImmutableRelyingPartyRegistrationRequest;
import org.springframework.security.web.webauthn.management.RelyingPartyPublicKey;
import org.springframework.security.web.webauthn.management.WebAuthnRelyingPartyOperations;
import org.springframework.security.web.webauthn.registration.PublicKeyCredentialCreationOptionsRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomPublicKeyCredentialCreationOptionsService {

        private final PublicKeyCredentialCreationOptionsRepository creationOptionsRepository;
        private final WebAuthnRelyingPartyOperations rpOptions;
        private final Snowflake snowflake;
        private final AppUserRepository userRepository;
        private final PublicKeyCredentialRpEntity rpEntity;

        public PublicKeyCredentialCreationOptions getPublicKeyCredentialCreationOptions(
                        PasskeyRegistrationRequestDto dto,
                        HttpServletRequest request,
                        HttpServletResponse response) {
                byte[] userId = Longs.toByteArray(snowflake.nextId());
                Bytes challenge = Bytes.random();

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
                List<PublicKeyCredentialParameters> publicKeyCredentialParameters = new ArrayList<>(List.of(PublicKeyCredentialParameters.EdDSA,
                        PublicKeyCredentialParameters.ES256,
                        PublicKeyCredentialParameters.ES384,
                        PublicKeyCredentialParameters.ES512,
                        PublicKeyCredentialParameters.RS256));

                Duration timeout = Duration.ofMillis(300000L);

                List<PublicKeyCredentialDescriptor> excludeCredentials = Collections.emptyList();


                AuthenticatorSelectionCriteria authenticatorSelection = AuthenticatorSelectionCriteria.builder()
                        .authenticatorAttachment(null)
                                .residentKey(ResidentKeyRequirement.REQUIRED)
                                .userVerification(UserVerificationRequirement.REQUIRED)
                                .build();

                AttestationConveyancePreference attestation = AttestationConveyancePreference.NONE;

                var extensions = this.getAuthenticationExtensionsClientInputs();

                PublicKeyCredentialCreationOptions options = PublicKeyCredentialCreationOptions.builder()
                                .challenge(challenge)
                                .rp(rpEntity)
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

        public CredentialRecord getCredentialRecord(
                        RegistrationRequest dto,
                        String label,
                        HttpServletRequest request,
                        HttpServletResponse response) {
                PublicKeyCredentialCreationOptions options = this.creationOptionsRepository.load(request);

                if (options == null) {
                        throw new IllegalStateException("Registration flow not started or expired.");
                }

                var registrationRequest = new ImmutableRelyingPartyRegistrationRequest(options,
                                new RelyingPartyPublicKey(dto.toPublicKeyCredential(), label));

                CredentialRecord savedRecord = this.rpOptions.registerCredential(registrationRequest);

                userRepository.save(dto.toUser());

                this.creationOptionsRepository.save(request, response, null);

                return savedRecord;
        }

        private AuthenticationExtensionsClientInputs getAuthenticationExtensionsClientInputs() {
                var prfInput = new PrfAuthenticationExtensionsClientInput(new PrfAuthenticationExtensionsClientInput.PrfValues(Bytes.random()));

                var credProtect = new CredProtectAuthenticationExtensionsClientInput( new CredProtectAuthenticationExtensionsClientInput.CredProtect(
                        CredProtectAuthenticationExtensionsClientInput.CredProtect.ProtectionPolicy.USER_VERIFICATION_REQUIRED, true
                ));

                var credProps = new CredPropsAuthenticationExtensionsClientInput();


            return new ImmutableAuthenticationExtensionsClientInputs(
                    List.of(credProps, prfInput, credProtect));
        }

}
