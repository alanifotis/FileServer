package home.fileserver.service;

import home.fileserver.dto.PasskeyRegistrationRequestDto;
import home.fileserver.dto.RegistrationRequest;
import home.fileserver.models.CredPropsAuthenticationExtensionsClientInput;
import home.fileserver.models.PrfAuthenticationExtensionsClientInput;
import home.fileserver.models.PrfAuthenticationExtensionsClientInput.Eval;
import home.fileserver.models.User;
import home.fileserver.models.UserCredential;
import home.fileserver.repositories.AppUserRepository;
import home.fileserver.repositories.UserCredentialRepository;
import home.fileserver.utilities.Longs;
import home.fileserver.utilities.Snowflake;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.web.webauthn.api.*;
import org.springframework.security.web.webauthn.authentication.PublicKeyCredentialRequestOptionsRepository;
import org.springframework.security.web.webauthn.management.ImmutableRelyingPartyRegistrationRequest;
import org.springframework.security.web.webauthn.management.RelyingPartyPublicKey;
import org.springframework.security.web.webauthn.management.WebAuthnRelyingPartyOperations;
import org.springframework.security.web.webauthn.registration.PublicKeyCredentialCreationOptionsRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomPublicKeyCredentialCreationOptionsService {

        private final PublicKeyCredentialCreationOptionsRepository creationOptionsRepository;
        private final WebAuthnRelyingPartyOperations rpOptions;
        private final Snowflake snowflake;
        private final AppUserRepository userRepository;
        private final PublicKeyCredentialRpEntity rpEntity;
        private final UserCredentialRepository credentialRepository;
        private final PublicKeyCredentialRequestOptionsRepository requestOptionsRepository;

        private static final String LABEL = "Registration Key";

        Duration TIMEOUT = Duration.ofMillis(300000L);

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
                List<PublicKeyCredentialParameters> publicKeyCredentialParameters = new ArrayList<>(
                                List.of(PublicKeyCredentialParameters.EdDSA,
                                                PublicKeyCredentialParameters.ES256,
                                                PublicKeyCredentialParameters.ES384,
                                                PublicKeyCredentialParameters.ES512,
                                                PublicKeyCredentialParameters.RS256));

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
                                .timeout(TIMEOUT)
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
                        HttpServletRequest request,
                        HttpServletResponse response) {
                PublicKeyCredentialCreationOptions options = this.creationOptionsRepository.load(request);

                if (options == null) {
                        throw new IllegalStateException("Registration flow not started or expired.");
                }

                Bytes userIdBytes = options.getUser().getId();
                long userId = Longs.fromByteArray(userIdBytes.getBytes());

                User newUser = dto.toUser(userId, dto.email());

                userRepository.insertUser(newUser);

                var registrationRequest = new ImmutableRelyingPartyRegistrationRequest(options,
                                new RelyingPartyPublicKey(dto.toPublicKeyCredential(), LABEL));

                CredentialRecord savedRecord = ScopedValue
                                .where(CustomJdbcUserCredentialRepository.PRF_SCOPE, dto.prfContext())
                                .call(() -> {
                                        // The library calls repo.save(), which reads the Scope
                                        return this.rpOptions.registerCredential(registrationRequest);
                                });

                this.creationOptionsRepository.save(request, response, null);

                return savedRecord;
        }

        public PublicKeyCredentialRequestOptions getPublicKeyCredentialRequestOptions(String email,
                        HttpServletRequest request,
                        HttpServletResponse response) {

                User user = userRepository.findByEmail(email);

                if (user == null) {
                        throw new IllegalStateException("User not found.");
                }

                List<UserCredential> credentials = credentialRepository.findByUserId(user.getId());

                if (credentials.isEmpty()) {
                        throw new IllegalStateException("No passkeys found for this user.");
                }

                Map<String, Object> evalByCredentialMap = new HashMap<>();

                List<PublicKeyCredentialDescriptor> allowCredentials = new ArrayList<>();

                for (UserCredential cred : credentials) {
                        

                        Set<AuthenticatorTransport> transports = new HashSet<>();
                        if (StringUtils.hasText(cred.getAuthenticatorTransports())) {
                                for (String t : StringUtils
                                                .commaDelimitedListToStringArray(cred.getAuthenticatorTransports())) {
                                        try {
                                                transports.add(AuthenticatorTransport.valueOf(t));
                                        } catch (IllegalArgumentException ignored) {
                                                // Ignore unknown transports for forward compatibility
                                        }
                                }
                        }

                        // A. Add to Allow List
                        allowCredentials.add(PublicKeyCredentialDescriptor.builder()
                                        .id(Bytes.fromBase64(cred.getCredentialId()))
                                        .type(PublicKeyCredentialType.PUBLIC_KEY)
                                        .transports(transports)
                                        .build());

                        // B. Add to PRF Map
                        // We map THIS specific Credential ID to THIS specific Salt
                        Bytes specificSalt = Bytes.fromBase64(cred.getPrfSalt());

                        evalByCredentialMap.put(
                                        cred.getCredentialId(), // The Key: Base64URL ID
                                        Map.of("first",  specificSalt) // The Value: Input for PRF
                        );
                }

                AuthenticationExtensionsClientInput<Map<String, Object>> inputs = new ImmutableAuthenticationExtensionsClientInput<Map<String, Object>>(
                                "prf", Map.of("evalByCredential", evalByCredentialMap));

                AuthenticationExtensionsClientInputs extensions = new ImmutableAuthenticationExtensionsClientInputs(
                                Collections.singletonList(inputs));
                PublicKeyCredentialRequestOptions options = PublicKeyCredentialRequestOptions.builder()
                                .challenge(Bytes.random())
                                .rpId(rpEntity.getId())
                                .timeout(TIMEOUT)
                                .allowCredentials(allowCredentials)
                                .userVerification(UserVerificationRequirement.REQUIRED)
                                .extensions(extensions)
                                .build();

                this.requestOptionsRepository.save(request, response, options);

                return options;
        }

        private AuthenticationExtensionsClientInputs getAuthenticationExtensionsClientInputs() {
                var prfInput = new PrfAuthenticationExtensionsClientInput(new Eval());

                var credProps = new CredPropsAuthenticationExtensionsClientInput();

                return new ImmutableAuthenticationExtensionsClientInputs(
                                List.of(credProps, prfInput));
        }

}
