package home.fileserver.configs;

import javax.sql.DataSource;

import org.springframework.boot.security.autoconfigure.web.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseCookie.ResponseCookieBuilder;
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
                    passkeys.rpId("localhost");
                    passkeys.allowedOrigins("https://localhost:8443", "https://192.168.0.149:8443", "http://localhost:8080" );
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

}
