package home.fileserver.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.webauthn.jackson.WebauthnJacksonModule;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import org.springframework.security.web.webauthn.registration.PublicKeyCredentialCreationOptionsRepository;
import org.springframework.http.converter.json.JacksonJsonHttpMessageConverter;

import static org.springframework.security.config.Customizer.withDefaults;

import home.fileserver.utilities.SpaCsrfTokenRequestHandler;
import lombok.extern.log4j.Log4j2;
import tools.jackson.databind.json.JsonMapper;

@Configuration
@Log4j2
class SecurityConfiguration {

    private final String[] ALLOWED_PATHS = {
            "/",
            "/login",
            "/login/options",
            "/login.html",
            "/register",
            "/register.html",
            "/registration/options",
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
            PublicKeyCredentialCreationOptionsRepository creationOptionsRepository,
            WebauthnJacksonModule webauthnModule) throws Exception {
        log.info("RpID: {}, class: {}", rpEntityId, this.getClass().getName());

        return http
                .redirectToHttps(withDefaults())
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(ALLOWED_PATHS).permitAll();
                    auth.anyRequest().authenticated();
                })
                .webAuthn(passkeys -> {
                    passkeys.rpId(rpEntityId);
                    passkeys.allowedOrigins(ALLOWED_HOSTS);
                    passkeys.creationOptionsRepository(creationOptionsRepository);
                    passkeys.disableDefaultRegistrationPage(true);
                    HttpMessageConverter<Object> converter = new JacksonJsonHttpMessageConverter(
                            JsonMapper.builder().addModule(webauthnModule).build());
                    passkeys.messageConverter(converter);
                })
                .logout(logout -> logout.logoutSuccessUrl("/"))
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
