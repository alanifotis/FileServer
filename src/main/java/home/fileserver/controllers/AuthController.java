package home.fileserver.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import home.fileserver.dto.UserDto;
import home.fileserver.models.User;
import org.springframework.stereotype.Controller;

@Controller
@Log4j2
@RequiredArgsConstructor
public class AuthController {
    @GetMapping("/api/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal User user) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            log.error("SecurityContext is empty or user is anonymous!");
            return ResponseEntity.status(401).build();
        }

        log.info("User ID: {}", user.getId());


        return ResponseEntity.ok(UserDto.fromUser(user));
    }

    @GetMapping("/dashboard")
    public String getDashboardPage(HttpServletRequest request, HttpServletResponse response) {
        return "forward:/dashboard.html";
    }

    @GetMapping({"/", "/api/files/ls"})
    @PreAuthorize("isAuthenticated()")
    public String getHome() {
        return "forward:/files.html";
    }
}
