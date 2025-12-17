package home.fileserver.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.webauthn.jackson.WebauthnJacksonModule;

@Configuration
public class JacksonConfig {

    @Bean
    public WebauthnJacksonModule webauthnJacksonModule() {
        // This automatically registers the module with Spring's default ObjectMapper
        return new WebauthnJacksonModule();
    }
}