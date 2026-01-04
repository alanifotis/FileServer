package home.fileserver.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import home.fileserver.dto.FileItem;
import home.fileserver.models.User;
import home.fileserver.repositories.AppUserRepository;
import home.fileserver.service.FileStorageService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;
    private final AppUserRepository userRepository;

    public FileController(FileStorageService fileStorageService, AppUserRepository userRepository) {
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            // Parameters for Resumability (Optional)
            @RequestParam(value = "chunkIndex", defaultValue = "0") int chunkIndex,
            @RequestParam(value = "totalChunks", defaultValue = "1") int totalChunks,
            // We get the User ID from the Security Context (Authentication)
            // Assuming you have a UserDetails object setup
            @AuthenticationPrincipal User user) {
        try {

            Path userFolder = fileStorageService.getUserRootPath(user.getId());
            if (!Files.exists(userFolder)) {
                fileStorageService.initUserRoot(user.getId());
            }

            boolean isChunked = totalChunks > 1;

            String savedName = fileStorageService.storeFile(
                    userFolder,
                    file,
                    isChunked,
                    chunkIndex);

            return ResponseEntity.ok(Map.of(
                    "message", "Upload successful",
                    "fileName", savedName,
                    "chunk", chunkIndex));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/set-avatar")
    public ResponseEntity<?> postMethodName(
            @RequestParam("avatar") MultipartFile file,
            @RequestParam(value = "chunkIndex", defaultValue = "0") int chunkIndex,
            @RequestParam(value = "totalChunks", defaultValue = "1") int totalChunks,
            @AuthenticationPrincipal User user) {

        try {

            Path avatarPath = fileStorageService.getUserAvatarPath(user.getId());

            if (!doesPathExist(avatarPath)) {
                Files.createDirectories(avatarPath);
            }

            user.setAvatarId(0L);

            this.userRepository.save(user);

            String savedName = fileStorageService.storeAvatar(avatarPath, file);

            return ResponseEntity.ok(Map.of(
                    "message", "Upload successful",
                    "fileName", savedName,
                    "chunk", chunkIndex));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<FileItem>> getUserFiles(@AuthenticationPrincipal User user) {
        List<FileItem> files = fileStorageService.listUserFiles(user.getId());
        return ResponseEntity.ok(files);
    }    

    private boolean doesPathExist(Path path) {
        return Files.exists(path);
    }
}