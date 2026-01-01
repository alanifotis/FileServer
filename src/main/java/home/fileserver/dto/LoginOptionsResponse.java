package home.fileserver.dto;

import java.util.Map;

import org.springframework.security.web.webauthn.api.PublicKeyCredentialRequestOptions;

import home.fileserver.dto.RegistrationRequest.PrfContext;

public record LoginOptionsResponse(
    PublicKeyCredentialRequestOptions options,
    Map<String, PrfContext> authContexts
) {
    
}
