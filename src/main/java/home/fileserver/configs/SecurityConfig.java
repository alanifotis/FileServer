package home.fileserver.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import org.springframework.security.web.webauthn.registration.PublicKeyCredentialCreationOptionsRepository;

import static org.springframework.security.config.Customizer.withDefaults;

import home.fileserver.utilities.SpaCsrfTokenRequestHandler;
import lombok.extern.log4j.Log4j2;

@Configuration
// Only enable if there is already a passkey registered
// @EnableMultiFactorAuthentication(
// authorities = { FactorGrantedAuthority.OTT_AUTHORITY,
// FactorGrantedAuthority.WEBAUTHN_AUTHORITY })
@Log4j2
class SecurityConfiguration {

    private final String[] ALLOWED_PATHS = {
            "/",
            "/login",
            "/register",
            "/register.html",
            "/registration/start",
            "/install-cert",
            "/favicon.ico",
            "/index.html",
            "/css/**",
            "/error",
            "/js/**"
    };

    private final String[] ALLOWED_HOSTS = {
            "https://localhost:8443",
            "https://192.168.0.149:8443",
            "http://localhost:8080",
            "http://192.168.0.149:8080",
            "https://192.168.0.149:80",
            "https://192.168.10.161:8443",
            "http://192.168.10.161:8080",
    };

    @Value("${fileserver.PublicKeyCredentialRpEntity.id}")
    private String rpEntityId;

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            UserCredentialRepository userCredentialRepository,
            PublicKeyCredentialCreationOptionsRepository creationOptionsRepository
    ) throws Exception {
        log.info("RpID: {}, class: {}", rpEntityId, this.getClass().getName());

        return http
                .redirectToHttps(withDefaults())
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(ALLOWED_PATHS).permitAll();
                    auth.anyRequest().authenticated();
                })
                .formLogin(withDefaults())
                .webAuthn(passkeys -> {
                    passkeys.rpId(rpEntityId);
                    passkeys.allowedOrigins(ALLOWED_HOSTS);
                    passkeys.creationOptionsRepository(creationOptionsRepository);
                    passkeys.disableDefaultRegistrationPage(true);
                })
                .logout(logout -> logout.logoutSuccessUrl("/login"))
                .csrf(csrf -> {
                    var repo = new CookieCsrfTokenRepository();
                    repo.setCookieCustomizer(c -> c.httpOnly(false)
                            .secure(true)
                            .sameSite("Lax")
                            .path("/")
                            .build());
                    csrf.csrfTokenRepository(repo);
                    csrf.csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler());
                })
                .build();
    }

}
