package home.fileserver.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;

import home.fileserver.dto.UserDto;
import home.fileserver.models.User;
import org.springframework.stereotype.Controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Controller
@Log4j2
public class DashboardController {

    @GetMapping("/api/me")
    public ResponseEntity<UserDto> getCurrentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            log.error("SecurityContext is empty or user is anonymous!");
            return ResponseEntity.status(401).build();
        }

        User principal = (User) auth.getPrincipal();

        return ResponseEntity.ok(UserDto.fromUser(principal));
    }

    @GetMapping("/dashboard")
    public String getDashboardPage(HttpServletRequest request, HttpServletResponse response) {
        return "forward:/dashboard.html";
    }

    @GetMapping("/files")
    public String getFilesPage(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("C", null);
        return "forward:/files.html";
    }

}
