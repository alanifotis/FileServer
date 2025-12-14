package home.fileserver.configs;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.webauthn.management.JdbcPublicKeyCredentialUserEntityRepository;
import org.springframework.security.web.webauthn.management.JdbcUserCredentialRepository;
import org.springframework.security.web.webauthn.management.PublicKeyCredentialUserEntityRepository;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import static org.springframework.security.config.Customizer.withDefaults;

import home.fileserver.utilities.SpaCsrfTokenRequestHandler;
import home.fileserver.repositories.CustomPublicKeyCredentialCreationOptionsRepository;

@Configuration
// Only enable if there is already a passkey registered
//@EnableMultiFactorAuthentication(
//        authorities = { FactorGrantedAuthority.OTT_AUTHORITY, FactorGrantedAuthority.WEBAUTHN_AUTHORITY })
class SecurityConfiguration {
    private final String[] ALLOWED_PATHS = 
    {
        "/",
        "/login",
        "/register",
        "/install-cert",
        "/favicon.ico", 
        "/index.html", 
        "/css/**",
        "/error",
        "/js/**"
    };

    private final String[] ALLOWED_HOSTS = 
    {
        "https://localhost:8443",
        "https://192.168.0.149:8443",
        "http://localhost:8080",
        "http://192.168.0.149:8080",
        "https://192.168.0.149:80", 
        "https://192.168.10.161:8443", 
        "http://192.168.10.161:8080",
    };

    private final String RP_ID = "localhost";

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .redirectToHttps(withDefaults())
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(ALLOWED_PATHS).permitAll();
                    auth.anyRequest().authenticated();
                })
                .formLogin(withDefaults())
                .webAuthn(passkeys -> {
                    passkeys.rpId(RP_ID);
                    passkeys.allowedOrigins(ALLOWED_HOSTS);
                    passkeys.creationOptionsRepository(creationOptionsRepository());
                })
                .logout(logout -> logout.logoutSuccessUrl("/login"))
                .csrf(csrf -> {
                    // Ignore CSRF so we do not have to deal with it in pure JS implementations.
                    // Avoid doing this, instead following Spring Security's recommendations for CSRF:
                    // https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html#csrf-integration-javascript
                    csrf.ignoringRequestMatchers("/webauthn/**", "/login/webauthn");
                    // Instead you should be doing this:
                    var repo = new CookieCsrfTokenRepository();
                    repo.setCookieCustomizer(c -> 
                        c.httpOnly(false)
                        .sameSite("Lax")
                        .build()

                    );
                    csrf.csrfTokenRepository(repo);
                    csrf.csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler());
                })
                .build();
    }

    @Bean
    UserDetailsService userDetailsService(DataSource dataSource) {
        return new JdbcUserDetailsManager(dataSource);
    }

    @Bean
    UserCredentialRepository passkeyRepo(JdbcOperations jdbcOperations) {
        return new JdbcUserCredentialRepository(jdbcOperations);
    }

    @Bean
    PublicKeyCredentialUserEntityRepository passkeyToUserRepo(JdbcOperations jdbcOperations) {
        return new JdbcPublicKeyCredentialUserEntityRepository(jdbcOperations);
    }

    @Bean
    CustomPublicKeyCredentialCreationOptionsRepository creationOptionsRepository() {
        return new CustomPublicKeyCredentialCreationOptionsRepository();
    }

}
