package home.fileserver.configs;

import org.apache.tika.Tika;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;

@Configuration
public class TikaConfig {
    @Bean
    public Tika tika() {
        return new Tika();
    }
}
