package home.fileserver.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialRpEntity;
import org.springframework.security.web.webauthn.authentication.HttpSessionPublicKeyCredentialRequestOptionsRepository;
import org.springframework.security.web.webauthn.authentication.PublicKeyCredentialRequestOptionsRepository;
import org.springframework.security.web.webauthn.management.*;
import org.springframework.security.web.webauthn.registration.HttpSessionPublicKeyCredentialCreationOptionsRepository;
import org.springframework.security.web.webauthn.registration.PublicKeyCredentialCreationOptionsRepository;

import home.fileserver.service.CustomJdbcUserCredentialRepository;

import javax.sql.DataSource;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class PublicKeyCredentialsConfiguration {

    private final DataSource dataSource;
    private final JdbcOperations jdbcOperations;
    public static final Set<String> ALLOWED_ORIGINS = Set.of(
            "https://localhost:8443", // Allow local testing
            "https://witt-solution.local:8443", // Allow production
            "https://home.local:8443",
            "https://alanis-laptop.local:8443" // Allow www subdomain
    );
    // private final home.fileserver.repositories.UserCredentialRepository credRepo;
    // private final AppUserRepository userRepo;
    @Value("${fileserver.PublicKeyCredentialRpEntity.name}")
    private String rpName;
    @Value("${fileserver.PublicKeyCredentialRpEntity.id}")
    private String rpEntityId;

    @Bean
    UserDetailsService userDetailsService() {
        return new JdbcUserDetailsManager(dataSource);
    }

    // @Bean
    // UserCredentialRepository passkeyRepo() {
    //     return new CustomJdbcUserCredentialRepository(credRepo, userRepo);
    // }

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
    WebAuthnRelyingPartyOperations relyingPartyOperations(
            PublicKeyCredentialUserEntityRepository userEntities,
            CustomJdbcUserCredentialRepository userCredentials,
            PublicKeyCredentialRpEntity rpEntity
            ) {
        return new Webauthn4JRelyingPartyOperations(userEntities, userCredentials, rpEntity, PublicKeyCredentialsConfiguration.ALLOWED_ORIGINS);
    }

    @Bean
    public PublicKeyCredentialRequestOptionsRepository getPublicKeyCredentialRequestOptionsRepository() {
        return new HttpSessionPublicKeyCredentialRequestOptionsRepository();
    }
}
