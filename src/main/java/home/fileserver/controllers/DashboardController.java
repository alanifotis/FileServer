package home.fileserver.controllers;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;

import home.fileserver.dto.UserDto;
import home.fileserver.models.User;
import home.fileserver.service.FileStorageService;

import org.springframework.stereotype.Controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Controller
@Log4j2
public class DashboardController {

    private final FileStorageService fileService;

    public DashboardController(FileStorageService fileService) {
        this.fileService = fileService;
    }


    @GetMapping("/api/me")
    public ResponseEntity<?> getCurrentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            log.error("SecurityContext is empty or user is anonymous!");
            return ResponseEntity.status(401).build();
        }

        User principal = (User) auth.getPrincipal();

        // 2. Log the ACTUAL class type
        log.info("================ SESSION DEBUG ================");
        log.info("Authentication Type: {}", auth.getClass().getName());
        log.info("Principal Type:      {}", principal.getClass().getName());
        log.info("Principal Data:      {}", principal);
        log.info("===============================================");

        Resource avataResource = this.fileService.getAvatar(principal.getId());

        UserDto dto = new UserDto(
            principal.getEmail(),
            principal.getDisplayName(),
            null,
            principal.getPlanTier().toString(),
            principal.getStorageUsedBytes(),
            principal.getRootFolderId());

        // 3. Return the raw principal so you can see it in the browser console
        return ResponseEntity.ok(principal);

    }

    @GetMapping("/dashboard")
    public String getDashboardPage(HttpServletRequest request, HttpServletResponse response) {
        return "forward:/dashboard.html";
    }

    @GetMapping("/files")
    public String getFilesPage(HttpServletRequest request, HttpServletResponse response) {
        return "forward:/files.html";
    }

}
