package home.fileserver.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialRpEntity;
import org.springframework.security.web.webauthn.authentication.HttpSessionPublicKeyCredentialRequestOptionsRepository;
import org.springframework.security.web.webauthn.authentication.PublicKeyCredentialRequestOptionsRepository;
import org.springframework.security.web.webauthn.authentication.WebAuthnAuthenticationProvider;
import org.springframework.security.web.webauthn.management.WebAuthnRelyingPartyOperations;
import org.springframework.security.web.webauthn.management.Webauthn4JRelyingPartyOperations;
import org.springframework.security.web.webauthn.registration.HttpSessionPublicKeyCredentialCreationOptionsRepository;
import org.springframework.security.web.webauthn.registration.PublicKeyCredentialCreationOptionsRepository;

import home.fileserver.repositories.AppUserRepository;
import home.fileserver.service.CustomJdbcUserCredentialRepository;
import home.fileserver.service.CustomUserEntityRepository;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class PublicKeyCredentialsConfiguration {

    public static final Set<String> ALLOWED_ORIGINS = Set.of(
            "https://localhost:8443",
            "https://witt-solution.local:8443",
            "https://home.local:8443",
            "https://alanis-laptop.local:8443",
            "https://pixel.local:8443"
    );

    @Value("${fileserver.publickeycredentialrpentity.name}")
    private String rpName;
    @Value("${fileserver.publickeycredentialrpentity.id}")
    private String rpEntityId;

    @Bean
    PublicKeyCredentialRpEntity getPublicKeyCredentialRpEntity() {
        return PublicKeyCredentialRpEntity
                .builder()
                .id(rpEntityId)
                .name(rpName)
                .build();
    }

    @Bean
    PublicKeyCredentialCreationOptionsRepository getPublicKeyCredentialCreationOptionsRepository() {
        return new HttpSessionPublicKeyCredentialCreationOptionsRepository();
    }

     @Bean
    public PublicKeyCredentialRequestOptionsRepository getPublicKeyCredentialRequestOptionsRepository() {
        return new HttpSessionPublicKeyCredentialRequestOptionsRepository();
    }

    @Bean
    public AuthenticationProvider getWebAuthnAuthenticationProvider(WebAuthnRelyingPartyOperations webAuthnRelyingPartyOperations, UserDetailsService userDetailsService) throws Exception {

        return new WebAuthnAuthenticationProvider(webAuthnRelyingPartyOperations, userDetailsService);
    }

    @Bean
    UserDetailsService userDetailsService(AppUserRepository userRepo) {
        return email -> userRepo.findByEmail(email); 
    }


    @Bean
    WebAuthnRelyingPartyOperations getWebAuthnRelyingPartyOperations(
            CustomUserEntityRepository userEntities,
            CustomJdbcUserCredentialRepository userCredentials) {
        return new Webauthn4JRelyingPartyOperations(userEntities, userCredentials, this.getPublicKeyCredentialRpEntity(), PublicKeyCredentialsConfiguration.ALLOWED_ORIGINS);
    }
}
