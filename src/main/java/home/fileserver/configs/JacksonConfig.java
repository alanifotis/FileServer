package home.fileserver.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.jackson.SecurityJacksonModules;
import org.springframework.security.web.webauthn.jackson.WebauthnJacksonModule;

import home.fileserver.dto.PrfClientOutput;
import home.fileserver.models.User;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.jsontype.BasicPolymorphicTypeValidator;

@Configuration
public class JacksonConfig {

    @Bean
    public WebauthnJacksonModule webauthnJacksonModule() {
        WebauthnJacksonModule module = new WebauthnJacksonModule();

        module.setMixInAnnotation(PrfClientOutput.class, PrfClientOutputMixin.class);
        module.setMixInAnnotation(PrfClientOutput.Prf.class, PrfClientOutputMixin.PrfMixin.class);
        module.setMixInAnnotation(PrfClientOutput.Prf.Results.class, PrfClientOutputMixin.ResultsMixin.class);

        return module;
    }

    @Bean
    public ObjectMapper getObjectMapper(WebauthnJacksonModule module) {
        ClassLoader loader = getClass().getClassLoader();
        BasicPolymorphicTypeValidator.Builder typeValidatorBuilder = BasicPolymorphicTypeValidator.builder()
        .allowIfSubType(SimpleGrantedAuthority.class)
                .allowIfSubType(User.class);
        ObjectMapper mapper = JsonMapper.builder()
                .addModules(SecurityJacksonModules.getModules(loader, typeValidatorBuilder))
                .addModule(module)
                .build();
        return mapper;
    }

}