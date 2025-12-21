package home.fileserver.controllers;

import home.fileserver.dto.PasskeyRegistrationRequestDto;
import home.fileserver.dto.RegistrationRequest;
import home.fileserver.service.CustomPublicKeyCredentialCreationOptionsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.webauthn.api.CredentialRecord;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialCreationOptions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@Log4j2
@RequiredArgsConstructor
public class RegisterController {

    private final CustomPublicKeyCredentialCreationOptionsService optionsService;


    @GetMapping("/register")
    public String registerPage() {
        return "forward:/register.html";
    }

    @PostMapping("/register")
    // @ResponseStatus(code = HttpStatus.CREATED, reason = "User exists.")
    public ResponseEntity<CredentialRecord> postMethodName(
        HttpServletRequest request,
        HttpServletResponse response,
        @RequestBody RegistrationRequest email) {
        /*
         * {
         * "email": "test@gmail.com",
         * "credential": {
         * "id": "j1ENF-aoDyfuWAbQQAoEfA",
         * "rawId": "j1ENF-aoDyfuWAbQQAoEfA",
         * "type": "public-key",
         * "response": {
         * "attestationObject":
         * "o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YViUSZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NdAAAAAOqbjWZNAR0hPOS2tIy1ddQAEI9RDRfmqA8n7lgG0EAKBHylAQIDJiABIVgglhFSZjnOlUX7rbnOWBYE5OyLg1rNdzLnCZaF74nPORwiWCCzHE9lmuQFbzHJMgKiD-kkbVbRzqj2Ue-NIDageYqE-Q",
         * "clientDataJSON":
         * "eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiaHBwZFVyUFZSV2ltTnoyRW5ZR2ZVdUk0YUM3bjVtZWQwR0FVTWZTR2RkSSIsIm9yaWdpbiI6Imh0dHBzOi8vbG9jYWxob3N0Ojg0NDMiLCJjcm9zc09yaWdpbiI6ZmFsc2UsIm90aGVyX2tleXNfY2FuX2JlX2FkZGVkX2hlcmUiOiJkbyBub3QgY29tcGFyZSBjbGllbnREYXRhSlNPTiBhZ2FpbnN0IGEgdGVtcGxhdGUuIFNlZSBodHRwczovL2dvby5nbC95YWJQZXgifQ",
         * "transports": [
         * "hybrid",
         * "internal"
         * ]
         * },
         * "clientExtensionResults": {
         * "prf": {
         * "enabled": true
         * }
         * },
         * "authenticatorAttachment": "cross-platform"
         * },
         * "label": "Registration Passkey"
         * 
         * private String id;
         * private @Nullable PublicKeyCredentialType type;
         * private Bytes rawId;
         * private R response;
         * private @Nullable AuthenticatorAttachment authenticatorAttachment;
         * private @Nullable AuthenticationExtensionsClientOutputs
         * clientExtensionResults;
         * 
         * 
         * }
         */

        // var response = AuthenticatorAttestationResponse.builder()
        // .attestationObject(Bytes.fromBase64(email))
        // .clientDataJSON(Bytes.fromBase64(email))
        // .transports(List.of(AuthenticatorTransport.valueOf(email),
        // AuthenticatorTransport.valueOf(email)))
        // .build();

        // PublicKeyCredential credentialKey = PublicKeyCredential
        // .builder()
        // .id(email)
        // .rawId(Bytes.fromBase64(email))
        // .type(PublicKeyCredentialType.PUBLIC_KEY)
        // .response(response)
        // .authenticatorAttachment(AuthenticatorAttachment.CROSS_PLATFORM)
        // .build();

        log.info("Device Response: {}", email);

        CredentialRecord cr = this.optionsService.getCredentialRecord(email, email.label(), request, response);

        return ResponseEntity.ok(cr);
    }

    @GetMapping("/install-cert")
    public ResponseEntity<Resource> downloadCaCert() {
        // Load file from src/main/resources/certs/rootCA.pem
        Resource file = new ClassPathResource("certs/ca.pem");

        try {
            log.info("Looking for file at: {}", file.getURI());
            log.info("File exists? {}", file.exists());
        } catch (Exception e) {
            log.error("Could not resolve file path: {}", e.getMessage());
        }

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/x-x509-ca-cert"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"ca.pem\"")
                .body(file);
    }

    @PostMapping("/registration/start")
    public ResponseEntity<PublicKeyCredentialCreationOptions> createRegistrationOptions(
            @RequestBody PasskeyRegistrationRequestDto dto,
            HttpServletRequest request,
            HttpServletResponse response) {
        log.info("Starting registration for: {}", dto.email());

        // // 1. Check if user exists
        // if (repo.findByEmail(email) != null) {
        // log.warn("User already exists: {}", email);
        // return ResponseEntity.status(HttpStatus.CONFLICT).build();
        // }

        // 2. Generate Options (using your custom service)

        PublicKeyCredentialCreationOptions options = this.optionsService
                .getPublicKeyCredentialCreationOptions(dto, request, response);

        log.info("RpID: {}", options.getRp().getId());

        response.setStatus(HttpServletResponse.SC_OK);
        response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        return ResponseEntity.ok(options);
    }

}