package home.fileserver.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import home.fileserver.dto.UserDto;
import home.fileserver.models.User;
import home.fileserver.service.FileMetadataService;

import org.springframework.stereotype.Controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Controller
@Log4j2
@RequiredArgsConstructor
public class AuthController {
    private final FileMetadataService metadataService;
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

    @GetMapping("/files")
    @PreAuthorize("isAuthenticated()")
    public Object getHome(@RequestParam(required = false) Long id, @AuthenticationPrincipal User user) {
        if (id == null) {
            return "forward:/auth.html";
        }

        log.info("Received Request for User Id: {}, and Folder Id: {}", user.getId(), id);

        var is_owner = id.equals(user.getId()) || this.metadataService.validateOwnerShip(id, user.getId());
        log.info("Is User Id: {}, owner of Folder Id: {}, result: {}", user.getId(), id, is_owner);


        if (!is_owner) {
            
            return ResponseEntity.notFound().build();
        }

        return "forward:/files.html";
    }

    @GetMapping("/")
    @PreAuthorize("isAuthenticated()")
    public String getHome() {
        return "forward:/files.html";
    }
}
