package home.fileserver.configs;

import java.util.Set;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialRpEntity;
import org.springframework.security.web.webauthn.management.JdbcPublicKeyCredentialUserEntityRepository;
import org.springframework.security.web.webauthn.management.PublicKeyCredentialUserEntityRepository;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import org.springframework.security.web.webauthn.management.WebAuthnRelyingPartyOperations;
import org.springframework.security.web.webauthn.management.Webauthn4JRelyingPartyOperations;
import home.fileserver.service.CustomJdbcUserCredentialRepository;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class PublicKeyCredentialsConfiguration {

    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;
    private final JdbcOperations jdbcOperations;
    private static final Set<String> ALLOWED_ORIGINS = Set.of(
            "http://localhost:8443", // Allow local testing
            "https://witt-solution.local:8443", // Allow production
            "https://home.local:8443" // Allow www subdomain
    );
    @Value("${fileserver.PublicKeyCredentialRpEntity.name}")
    private String rpName;
    @Value("${fileserver.PublicKeyCredentialRpEntity.id}")
    private String rpEntityId;

    @Bean
    UserDetailsService userDetailsService() {
        return new JdbcUserDetailsManager(dataSource);
    }

    @Bean
    UserCredentialRepository passkeyRepo() {
        return new CustomJdbcUserCredentialRepository(jdbcTemplate);
    }

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
    WebAuthnRelyingPartyOperations relyingPartyOperations(
            PublicKeyCredentialUserEntityRepository userEntities,
            UserCredentialRepository userCredentials,
            PublicKeyCredentialRpEntity rpEntity
            ) {
        return new Webauthn4JRelyingPartyOperations(userEntities, userCredentials, rpEntity, PublicKeyCredentialsConfiguration.ALLOWED_ORIGINS);
    }
}
