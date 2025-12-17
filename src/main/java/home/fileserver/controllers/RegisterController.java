package home.fileserver.controllers;

import home.fileserver.models.UserEntity;
import home.fileserver.repositories.AppUserRepository;
import home.fileserver.service.CustomPublicKeyCredentialCreationOptionsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialCreationOptions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.net.URI;

@Controller
@Log4j2
public class RegisterController {

    private final AppUserRepository repo;

    private final CustomPublicKeyCredentialCreationOptionsService optionsService;


    public RegisterController(
            AppUserRepository repo,
            CustomPublicKeyCredentialCreationOptionsService optionsService) {
        this.repo = repo;
        this.optionsService = optionsService;
    }

    @GetMapping("/register")
    public String registerPage() {
        return "forward:/register.html";
    }

    @PostMapping("/register")
    @ResponseStatus(code = HttpStatus.CREATED, reason = "User exists.")
    public ResponseEntity<UserEntity> postMethodName(HttpServletRequest request, @RequestBody String email) {
        var user = repo.findByEmail(email);

        if (user != null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .build();
        }

        return ResponseEntity.created(URI.create("")).body(null);
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
        @RequestBody String email,
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        log.info("Starting registration for: {}", email);

        // // 1. Check if user exists
        // if (repo.findByEmail(email) != null) {
        //     log.warn("User already exists: {}", email);
        //     return ResponseEntity.status(HttpStatus.CONFLICT).build();
        // }

        // 2. Generate Options (using your custom service)
        PublicKeyCredentialCreationOptions options = 
            this.optionsService.getPublicKeyCredentialCreationOptions(email, request, response);


        return ResponseEntity.ok(options);
    }
}