package home.fileserver.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
public class UserController {

    @GetMapping("/api/me")
    public ResponseEntity<?> getCurrentUser() {
        // @AuthenticationPrincipal automatically casts the SecurityContext principal 
        // to your JPA User entity because of the change above.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
        log.error("SecurityContext is empty or user is anonymous!");
        return ResponseEntity.status(401).build();
    }

    Object principal = auth.getPrincipal();

    // 2. Log the ACTUAL class type
    log.info("================ SESSION DEBUG ================");
    log.info("Authentication Type: {}", auth.getClass().getName());
    log.info("Principal Type:      {}", principal.getClass().getName());
    log.info("Principal Data:      {}", principal);
    log.info("===============================================");

    // 3. Return the raw principal so you can see it in the browser console
    return ResponseEntity.ok(principal);

    }
}
