package home.fileserver.configs;

import java.math.BigDecimal;
import java.math.BigInteger;

import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.webauthn.jackson.WebauthnJacksonModule;

import home.fileserver.dto.PrfClientOutput;
import home.fileserver.models.User;
import tools.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import tools.jackson.databind.module.SimpleModule;
import tools.jackson.databind.ser.std.ToStringSerializer;

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
    public JsonMapperBuilderCustomizer jacksonCustomizer(WebauthnJacksonModule webauthnModule) {
            return builder -> {
                SimpleModule longToStringModule = new SimpleModule();
                longToStringModule.addSerializer(Long.class, ToStringSerializer.instance);
                longToStringModule.addSerializer(Long.TYPE, ToStringSerializer.instance);
                longToStringModule.addSerializer(BigInteger.class, ToStringSerializer.instance);
                longToStringModule.addSerializer(BigDecimal.class, ToStringSerializer.instance);

                BasicPolymorphicTypeValidator typeValidatorBuilder = BasicPolymorphicTypeValidator.builder()
                                                .allowIfSubType(SimpleGrantedAuthority.class)
                                                .allowIfSubType(User.class)
                                                .build();

                builder.addModule(longToStringModule);
                builder.addModule(webauthnModule);
                builder.polymorphicTypeValidator(typeValidatorBuilder);
            };
        }

}