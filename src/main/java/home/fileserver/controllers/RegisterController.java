package home.fileserver.controllers;

import home.fileserver.dto.LoginOptionsResponse;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.webauthn.api.AuthenticatorAssertionResponse;
import org.springframework.security.web.webauthn.api.CredentialRecord;
import org.springframework.security.web.webauthn.api.PublicKeyCredential;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialCreationOptions;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialRequestOptions;
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
        return this.getAuthhtml();
    }

     @GetMapping("/login")
    public String loginPage() {
        return this.getAuthhtml();
    }

    private String getAuthhtml() {
        return "forward:/auth.html";
    }

    @GetMapping("/automagic")
    public ResponseEntity<PublicKeyCredentialRequestOptions> getAutomagicOptions(HttpServletRequest request, HttpServletResponse response) {
        var options = this.optionsService.autoMagicOptions(request, response);
        return ResponseEntity.ok(options);
    }

    @PostMapping("/automagic")
    public ResponseEntity<?> loginUsingAutomagic(HttpServletRequest request, HttpServletResponse response, @RequestBody PublicKeyCredential<AuthenticatorAssertionResponse> assertion) {
        try {
        var ok = this.optionsService.autoMagicLogin(request, response, assertion);
        return ResponseEntity.ok(ok);
        
    } 
    
    catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    }
    

    @PostMapping("/login")
    public ResponseEntity<Authentication> postMethodName(HttpServletRequest request, HttpServletResponse response, @RequestBody PublicKeyCredential<AuthenticatorAssertionResponse> assertion) {
        
        Authentication auth = optionsService.login(assertion, request, response);
        return ResponseEntity.ok(auth);
    }

    @PostMapping("/login/options")
    public ResponseEntity<LoginOptionsResponse> getLoginOptions(@RequestBody PasskeyRegistrationRequestDto dto,
            HttpServletRequest request, HttpServletResponse response) {
        log.warn("Received Email: {}", dto.email());
        LoginOptionsResponse options = this.optionsService.getPublicKeyCredentialRequestOptions(dto.email(), request,
                response);

        return ResponseEntity.ok(options);
    }

    @PostMapping("/register")
    // @ResponseStatus(code = HttpStatus.CREATED, reason = "User exists.")
    public ResponseEntity<CredentialRecord> registerWithPrf(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestBody RegistrationRequest dto) {

        CredentialRecord cr = this.optionsService.getCredentialRecord(dto, request, response);

        if (cr == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(cr);
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

    @PostMapping("/registration/options")
    public ResponseEntity<PublicKeyCredentialCreationOptions> createRegistrationOptions(
            @RequestBody PasskeyRegistrationRequestDto dto,
            HttpServletRequest request,
            HttpServletResponse response) {
        PublicKeyCredentialCreationOptions options = this.optionsService
                .getPublicKeyCredentialCreationOptions(dto, request, response);

        log.info("RpID: {}", options.getRp().getId());

        return ResponseEntity.ok(options);
    }

}