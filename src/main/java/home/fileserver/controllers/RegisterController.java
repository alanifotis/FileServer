package home.fileserver.controllers;

import home.fileserver.models.UserEntity;
import home.fileserver.repositories.CustomPublicKeyCredentialCreationOptionsRepository;
import home.fileserver.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.net.URI;
import java.util.UUID;

@Controller
@Log4j2
public class RegisterController {

    private final UserRepository repo;

    private final CustomPublicKeyCredentialCreationOptionsRepository optionsRepository;

    public RegisterController (UserRepository repo, CustomPublicKeyCredentialCreationOptionsRepository optionsRepository) {
        this.repo = repo;
        this.optionsRepository = optionsRepository;
    }

    @GetMapping("/register")
    public String registerPage() {
        return "forward:/register.html";
    }

    @PostMapping("/register")
    @ResponseStatus(
            value = HttpStatus.CREATED,
            code = HttpStatus.CONFLICT,
            reason = "User exists."
    )
    public ResponseEntity<Object> postMethodName(HttpServletRequest request, @RequestBody String email) {
        var user = repo.findByEmail(email);

        if (user != null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("User exists.");
        }

       return ResponseEntity.created(URI.create("")).body(new UserEntity(UUID.randomUUID(), (UserDetails) request.getUserPrincipal()));
    }

    @GetMapping("/install-cert")
    public ResponseEntity<Resource> downloadCaCert() {
        // Load file from src/main/resources/certs/rootCA.pem
        Resource file = new ClassPathResource("certs/ca.pem");

        try {
            log.info("Looking for file at: {}", file.getURI());
            log.info("File exists? {}",file.exists());
        } catch (Exception e) {
             log.error("Could not resolve file path: {}", e.getMessage());
        }

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                // This header tells the browser "This is a Certificate Authority file"
                // iOS and Android will recognize this and start the installation wizard.
                .contentType(MediaType.parseMediaType("application/x-x509-ca-cert"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"ca.pem\"")
                .body(file);
    }
}