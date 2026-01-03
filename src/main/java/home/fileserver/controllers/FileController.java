package home.fileserver.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import home.fileserver.dto.FileItem;
import home.fileserver.models.User;
import home.fileserver.service.FileStorageService;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
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
            boolean isChunked = totalChunks > 1;

            String savedName = fileStorageService.storeFile(
                    user.getId(),
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
            @RequestParam("file") MultipartFile file,
            // Parameters for Resumability (Optional)
            @RequestParam(value = "chunkIndex", defaultValue = "0") int chunkIndex,
            @RequestParam(value = "totalChunks", defaultValue = "1") int totalChunks,
            // We get the User ID from the Security Context (Authentication)
            // Assuming you have a UserDetails object setup
            @AuthenticationPrincipal User user) {

         try {
            boolean isChunked = totalChunks > 1;

            String savedName = fileStorageService.storeFile(
                    user.getId(),
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

    @GetMapping
    public ResponseEntity<List<FileItem>> getUserFiles(@AuthenticationPrincipal User user) {
        List<FileItem> files = fileStorageService.listUserFiles(user.getId());
        return ResponseEntity.ok(files);
    }
}