package home.fileserver.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialRpEntity;
import org.springframework.security.web.webauthn.authentication.HttpSessionPublicKeyCredentialRequestOptionsRepository;
import org.springframework.security.web.webauthn.authentication.PublicKeyCredentialRequestOptionsRepository;
import org.springframework.security.web.webauthn.authentication.WebAuthnAuthenticationProvider;
import org.springframework.security.web.webauthn.management.*;
import org.springframework.security.web.webauthn.registration.HttpSessionPublicKeyCredentialCreationOptionsRepository;
import org.springframework.security.web.webauthn.registration.PublicKeyCredentialCreationOptionsRepository;

import home.fileserver.service.CustomJdbcUserCredentialRepository;
import home.fileserver.utilities.CustomUserEntityRepository;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class PublicKeyCredentialsConfiguration {

    private final JdbcOperations jdbcOperations;
    public static final Set<String> ALLOWED_ORIGINS = Set.of(
            "https://localhost:8443", // Allow local testing
            "https://witt-solution.local:8443", // Allow production
            "https://home.local:8443",
            "https://alanis-laptop.local:8443" // Allow www subdomain
    );

    @Value("${fileserver.PublicKeyCredentialRpEntity.name}")
    private String rpName;
    @Value("${fileserver.PublicKeyCredentialRpEntity.id}")
    private String rpEntityId;

    @Bean
    PublicKeyCredentialUserEntityRepository passkeyToUserRepo() {
        return new JdbcPublicKeyCredentialUserEntityRepository(jdbcOperations);
    }

    @Bean
    PublicKeyCredentialRpEntity getPublicKeyCredentialRpEntity() {
        return PublicKeyCredentialRpEntity
                .builder()
                .id(rpEntityId)
                .name(rpName)
                .build();
    }

    @Bean
    PublicKeyCredentialCreationOptionsRepository getPublicKeyCredentialCreationOptionsRepository() {
        return new HttpSessionPublicKeyCredentialCreationOptionsRepository();
    }

     @Bean
    public PublicKeyCredentialRequestOptionsRepository getPublicKeyCredentialRequestOptionsRepository() {
        return new HttpSessionPublicKeyCredentialRequestOptionsRepository();
    }

    @Bean
    public AuthenticationProvider getWebAuthnAuthenticationProvider(WebAuthnRelyingPartyOperations webAuthnRelyingPartyOperations, UserDetailsService userDetailsService) throws Exception {
        return new WebAuthnAuthenticationProvider(webAuthnRelyingPartyOperations, userDetailsService);
    }


    @Bean
    WebAuthnRelyingPartyOperations getWebAuthnRelyingPartyOperations(
            CustomUserEntityRepository userEntities,
            CustomJdbcUserCredentialRepository userCredentials,
            PublicKeyCredentialRpEntity rpEntity
            ) {
        return new Webauthn4JRelyingPartyOperations(userEntities, userCredentials, rpEntity, PublicKeyCredentialsConfiguration.ALLOWED_ORIGINS);
    }
}
