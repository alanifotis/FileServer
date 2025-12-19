package home.fileserver.configs;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.webauthn.management.JdbcPublicKeyCredentialUserEntityRepository;
import org.springframework.security.web.webauthn.management.PublicKeyCredentialUserEntityRepository;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import org.springframework.security.web.webauthn.registration.PublicKeyCredentialCreationOptionsRepository;
import home.fileserver.repositories.JsonSessionRepository;
import home.fileserver.service.CustomJdbcUserCredentialRepository;
import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;

@Configuration
@RequiredArgsConstructor
public class PublicKeyCredentialsConfiguration {

    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;
    private final JdbcOperations jdbcOperations;
    private final ObjectMapper mapper;
    
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
    PublicKeyCredentialCreationOptionsRepository optRepo() {
        return new JsonSessionRepository(mapper);
    }
}
