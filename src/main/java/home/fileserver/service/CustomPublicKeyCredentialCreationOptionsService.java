package home.fileserver.service;

import home.fileserver.dto.LoginOptionsResponse;
import home.fileserver.dto.PasskeyRegistrationRequestDto;
import home.fileserver.dto.RegistrationRequest;
import home.fileserver.dto.RegistrationRequest.PrfContext;
import home.fileserver.models.CredPropsAuthenticationExtensionsClientInput;
import home.fileserver.models.PrfAuthenticationExtensionsClientInput;
import home.fileserver.models.PrfAuthenticationExtensionsClientInput.Eval;
import home.fileserver.models.User;
import home.fileserver.models.CustomUserCredential;
import home.fileserver.models.FileCategory;
import home.fileserver.repositories.AppUserRepository;
import home.fileserver.repositories.CustomUserCredentialRepository;
import home.fileserver.utilities.Longs;
import home.fileserver.utilities.Snowflake;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.webauthn.api.*;
import org.springframework.security.web.webauthn.authentication.PublicKeyCredentialRequestOptionsRepository;
import org.springframework.security.web.webauthn.authentication.WebAuthnAuthenticationRequestToken;
import org.springframework.security.web.webauthn.management.ImmutableRelyingPartyRegistrationRequest;
import org.springframework.security.web.webauthn.management.RelyingPartyAuthenticationRequest;
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
        private final CustomUserCredentialRepository credentialRepository;
        private final PublicKeyCredentialRequestOptionsRepository requestOptionsRepository;
        private final AuthenticationProvider authenticationManager;
        private final FileStorageService fileStorageService;
        private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
        private static final String LABEL = "Registration Key";
        private final FileMetadataService metadataService;

        private static final Duration TIMEOUT = Duration.ofMillis(300000L);

        public PublicKeyCredentialCreationOptions getPublicKeyCredentialCreationOptions(
                        PasskeyRegistrationRequestDto dto,
                        HttpServletRequest request,
                        HttpServletResponse response) {
                Bytes userId = Longs.toBytes(snowflake.nextId());
                Bytes challenge = Bytes.random();

                PublicKeyCredentialUserEntity user = ImmutablePublicKeyCredentialUserEntity.builder()
                                .id(userId)
                                .displayName(dto.email().substring(0, dto.email().indexOf('@')))
                                .name(dto.email())
                                .build();

                List<PublicKeyCredentialParameters> publicKeyCredentialParameters = new ArrayList<>(
                                List.of(
                                                PublicKeyCredentialParameters.EdDSA,
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

                AuthenticationExtensionsClientInputs extensions = this.getAuthenticationExtensionsClientInputs();

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

                var userCheck = this.userRepository.findByEmail(dto.email());

                if (userCheck != null) {
                        return null;
                }

                PublicKeyCredentialCreationOptions options = this.creationOptionsRepository.load(request);

                if (options == null) {
                        return null;
                }

                this.saveUserCreateRootDirectorySaveRootMetadata(
                                dto.toUser(Longs.fromBytes(options.getUser().getId()), dto.email()));

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

        public LoginOptionsResponse getPublicKeyCredentialRequestOptions(String email,
                        HttpServletRequest request,
                        HttpServletResponse response) {

                User user = userRepository.findByEmail(email);

                if (user == null) {
                        throw new IllegalStateException("User not found.");
                }

                List<CustomUserCredential> credentials = credentialRepository.findByUserId(user.getId());

                if (credentials.isEmpty()) {
                        throw new IllegalStateException("No passkeys found for this user.");
                }

                Map<String, Object> evalByCredentialMap = new HashMap<>();

                Map<String, PrfContext> prfContextMap = new HashMap<>();

                List<PublicKeyCredentialDescriptor> allowCredentials = new ArrayList<>();

                for (CustomUserCredential cred : credentials) {

                        Set<AuthenticatorTransport> transports = new HashSet<>();
                        if (StringUtils.hasText(cred.getAuthenticatorTransports())) {
                                for (String t : StringUtils
                                                .commaDelimitedListToStringArray(cred.getAuthenticatorTransports())) {
                                        try {
                                                transports.add(AuthenticatorTransport.valueOf(t));
                                        } catch (IllegalArgumentException ignored) {
                                                // Ignore unknown transports see:
                                                // https://www.w3.org/TR/webauthn-3/#enum-transport
                                        }
                                }
                        }

                        prfContextMap.put(cred.getCredentialId(),
                                        new PrfContext(cred.getPrfSalt(), cred.getPrfWrappedKey(), cred.getPrfIv()));

                        allowCredentials.add(PublicKeyCredentialDescriptor.builder()
                                        .id(Bytes.fromBase64(cred.getCredentialId()))
                                        .type(PublicKeyCredentialType.PUBLIC_KEY)
                                        .transports(transports)
                                        .build());

                        Bytes specificSalt = Bytes.fromBase64(cred.getPrfSalt());

                        evalByCredentialMap.put(
                                        cred.getCredentialId(),
                                        Map.of("first", specificSalt));
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

                return new LoginOptionsResponse(options, prfContextMap);
        }

        public Authentication login(PublicKeyCredential<AuthenticatorAssertionResponse> assertion,
                        HttpServletRequest request, HttpServletResponse response) {
                PublicKeyCredentialRequestOptions options = this.requestOptionsRepository.load(request);

                if (options == null) {
                        throw new BadCredentialsException(
                                        "Unable to authenticate the PublicKeyCredential. No PublicKeyCredentialRequestOptions found.");
                }

                this.requestOptionsRepository.save(request, response, null);

                RelyingPartyAuthenticationRequest authenticationRequest = new RelyingPartyAuthenticationRequest(options,
                                assertion);
                WebAuthnAuthenticationRequestToken token = new WebAuthnAuthenticationRequestToken(
                                authenticationRequest);

                Authentication authResult = this.authenticationManager.authenticate(token);

                User user = this.userRepository.findByEmail(authResult.getName());

                Authentication fullAuth = new UsernamePasswordAuthenticationToken(
                                user,
                                authResult.getCredentials(),
                                authResult.getAuthorities());

                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(fullAuth);

                SecurityContextHolder.setContext(context);

                this.securityContextRepository.saveContext(context, request, response);

                return fullAuth;

        }

        private AuthenticationExtensionsClientInputs getAuthenticationExtensionsClientInputs() {
                var prfInput = new PrfAuthenticationExtensionsClientInput(new Eval());

                var credProps = new CredPropsAuthenticationExtensionsClientInput();

                return new ImmutableAuthenticationExtensionsClientInputs(
                                List.of(credProps, prfInput));
        }

        private void saveUserCreateRootDirectorySaveRootMetadata(User newUser) {
                var user = userRepository.save(newUser);

                fileStorageService.initUserRoot(newUser.getId());

                this.metadataService.saveDirectoryMetadata(user, "Home", null, FileCategory.HOME);

                return;
        }
}
