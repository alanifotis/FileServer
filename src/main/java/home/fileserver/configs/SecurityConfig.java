package home.fileserver.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextHolderFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import org.springframework.security.web.webauthn.registration.PublicKeyCredentialCreationOptionsRepository;
import org.springframework.http.converter.json.JacksonJsonHttpMessageConverter;

import static org.springframework.security.config.Customizer.withDefaults;

import home.fileserver.configs.filters.AbsoluteSessionTimeoutFilter;
import home.fileserver.utilities.SpaCsrfTokenRequestHandler;
import lombok.extern.log4j.Log4j2;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

@Configuration
@Log4j2
class SecurityConfiguration {

        private final String[] ALLOWED_PATHS = {
                        "/",
                        "/automagic",
                        "/favicon/files.png",
                        "/login",
                        "/login/options",
                        "/login.html",
                        "/login/webauthn",
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
                        "https://192.168.0.149:80",
                        "https://192.168.10.161:8443",
                        "https://alanis-laptop.local:8443"
        };

        private final static String[] COOKIES = { "JSESSIONID", "__Host-SESSION", "XSRF-TOKEN" };

        @Value("${fileserver.publickeycredentialrpentity.id}")
        private String rpEntityId;

        @Bean
        SecurityFilterChain securityFilterChain(
                        HttpSecurity http,
                        UserCredentialRepository userCredentialRepository,
                        PublicKeyCredentialCreationOptionsRepository creationOptionsRepository,
                        ObjectMapper mapper) throws Exception {

                return http
                                .redirectToHttps(withDefaults())
                                .authorizeHttpRequests(auth -> {
                                        auth.requestMatchers(ALLOWED_PATHS).permitAll();
                                        auth.anyRequest().authenticated();
                                })
                                .securityContext(
                                                context -> context.securityContextRepository(
                                                                new HttpSessionSecurityContextRepository()))
                                .webAuthn(passkeys -> {
                                        passkeys.rpId(rpEntityId);
                                        passkeys.allowedOrigins(ALLOWED_HOSTS);
                                        passkeys.creationOptionsRepository(creationOptionsRepository);
                                        passkeys.disableDefaultRegistrationPage(true);
                                        HttpMessageConverter<Object> converter = new JacksonJsonHttpMessageConverter(
                                                        (JsonMapper) mapper);
                                        passkeys.messageConverter(converter);
                                })
                                .formLogin(formLogin -> formLogin
                                                .loginPage("/login")
                                                .defaultSuccessUrl("/dashboard")
                                                .failureUrl("/login?error=true")
                                                .permitAll()
                                                .disable())
                                .logout(logout -> logout
                                                .logoutUrl("/logout")
                                                .deleteCookies(COOKIES)
                                                .invalidateHttpSession(true)
                                                .clearAuthentication(true)
                                                .logoutSuccessUrl("/login?logout")
                                                .permitAll())
                                .csrf(csrf -> {
                                        var repo = new CookieCsrfTokenRepository();
                                        repo.setCookieCustomizer(c -> c.httpOnly(false)
                                                        .secure(true)
                                                        .sameSite("Strict")
                                                        .path("/")
                                                        .build());
                                        csrf.csrfTokenRepository(repo);
                                        csrf.csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler());
                                })
                                .sessionManagement(session -> session
                                                .maximumSessions(1)
                                                .maxSessionsPreventsLogin(false)
                                                .expiredUrl("/login?expired=true"))
                                .addFilterBefore(new AbsoluteSessionTimeoutFilter(), SecurityContextHolderFilter.class)
                                .exceptionHandling(e -> e
                                                .authenticationEntryPoint(
                                                                new LoginUrlAuthenticationEntryPoint("/login")))
                                .build();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        @Bean
        public HttpSessionEventPublisher httpSessionEventPublisher() {
                return new HttpSessionEventPublisher();
        }
}
