package home.fileserver.controllers;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.webauthn4j.data.RegistrationRequest;

import home.fileserver.service.WebAuthnRegistrationService;

import java.util.Map;

@RestController
@RequestMapping("/webauthn/register")
public class WebAuthnRegistrationController {

    private final WebAuthnRegistrationService registrationService;

    public WebAuthnRegistrationController(WebAuthnRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    /**
     * Step 1: Frontend asks for options.
     * We create a "User Creation Request" locally.
     */
    @PostMapping("/options")
    public ResponseEntity<String> getRegistrationOptions(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        // Returns the JSON that navigator.credentials.create() needs
        String optionsJson = registrationService.generateRegistrationOptions(username);
        return ResponseEntity.ok(optionsJson);
    }

    /**
     * Step 2: Frontend sends back the created credential.
     * We verify it and save the user + salt + credential to DB.
     */
    @PostMapping("")
    public ResponseEntity<Map<String, Object>> finishRegistration(@RequestBody RegistrationRequest request) {
        try {
            registrationService.finishRegistration(request);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}