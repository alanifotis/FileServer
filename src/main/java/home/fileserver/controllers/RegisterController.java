package home.fileserver.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import lombok.extern.log4j.Log4j2;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@Controller
@Log4j2
public class RegisterController {

    @GetMapping("/register")
    public String registerPage() {
        return "forward:/register.html";
    }

    @PostMapping("/register")
    public String postMethodName(@RequestBody String entity) {
        // TODO: process POST request
        return entity;
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