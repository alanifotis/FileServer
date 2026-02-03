package home.fileserver.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import home.fileserver.dto.BlobUploadResult;
import home.fileserver.dto.DirectoryDto;
import home.fileserver.dto.FileItem;
import home.fileserver.dto.FileUploadRequest;
import home.fileserver.models.FileMetadata;
import home.fileserver.models.User;
import home.fileserver.repositories.AppUserRepository;
import home.fileserver.service.FileBlobService;
import home.fileserver.service.FileMetadataService;
import home.fileserver.service.FileStorageService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;
    private final AppUserRepository userRepository;
    private final FileMetadataService metadataService;
    private final FileBlobService blobService;

    public FileController(
            FileStorageService fileStorageService,
            AppUserRepository userRepository,
            FileMetadataService metadataService,
            FileBlobService blobService) {
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.metadataService = metadataService;
        this.blobService = blobService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam MultipartFile file,
            @RequestParam(defaultValue = "0") int chunkIndex,
            @RequestParam(defaultValue = "1") int totalChunks,
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
            @RequestParam(defaultValue = "0") int chunkIndex,
            @RequestParam(defaultValue = "1") int totalChunks,
            @AuthenticationPrincipal User user) {

        try {

            Path avatarPath = fileStorageService.getUserAvatarPath(user.getId());

            if (!doesPathExist(avatarPath)) {
                Files.createDirectories(avatarPath);
            }

            user.setAvatar(null);

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

    @PostMapping(value = "/folder", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> createFolder(
            @AuthenticationPrincipal User user,
            @ModelAttribute DirectoryDto dto) {
        FileMetadata folder = this.metadataService.saveDirectoryMetadata(user, dto);
        return ResponseEntity.ok(Map.of("id", String.valueOf(folder.getId())));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(
            @AuthenticationPrincipal User user,
            @ModelAttribute FileUploadRequest request) throws IOException {

        BlobUploadResult result = blobService.uploadChunk(
                request.file().getInputStream(),
                request.uploadId(),
                request.chunkIndex(),
                request.isLastChunk(),
                request.file().getOriginalFilename(),
                user.getId()
            );

        if (!result.isComplete()) {
            return ResponseEntity.accepted().body(Map.of(
                    "status", "partial",
                    "uploadId", result.tempStorageId(),
                    "chunkIndex", request.chunkIndex()));
        }

        FileMetadata metadata = metadataService.saveFileMetadata(
                user,
                result.fileBlob(),
                request.file().getOriginalFilename(),
                result.detectedContentType(),
                request.parentId());

        return ResponseEntity.ok(Map.of(
                "status", "complete",
                "fileId", metadata.getId(),
                "fileName", metadata.getOriginalFilename()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        metadataService.hardDelete(id, user);
        return ResponseEntity.noContent().build();
    }

}