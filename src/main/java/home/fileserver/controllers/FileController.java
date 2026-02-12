package home.fileserver.controllers;

import org.jspecify.annotations.Nullable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import home.fileserver.dto.BlobUploadResult;
import home.fileserver.dto.DirectoryDto;
import home.fileserver.dto.FileItem;
import home.fileserver.dto.files.FolderViewDto;
import home.fileserver.models.FileMetadata;
import home.fileserver.models.User;
import home.fileserver.repositories.AppUserRepository;
import home.fileserver.service.FileBlobService;
import home.fileserver.service.FileMetadataService;
import home.fileserver.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
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
        @RequestPart("file") MultipartFile file,
        @RequestParam(required = false) Long parentId,
        @RequestParam(required = false) String uploadId,
        @RequestParam(defaultValue = "0") Integer chunkIndex,
        @RequestParam(defaultValue = "1") Integer totalChunks) {
    try {
        // Your logic remains clean
        BlobUploadResult result = blobService.uploadChunk(
                file.getInputStream(),
                uploadId,
                chunkIndex,
                (chunkIndex + 1) >= totalChunks,
                file.getOriginalFilename(),
                user.getId()
        );

        if (!result.isComplete()) {
            return ResponseEntity.accepted().body(Map.of(
                "status", "partial",
                "uploadId", result.tempStorageId(),
                "chunkIndex", chunkIndex));
        }

        FileMetadata metadata = metadataService.saveFileMetadata(
                user,
                result.fileBlob(),
                file.getOriginalFilename(),
                result.detectedContentType(),
                parentId);

        return ResponseEntity.ok(Map.of(
            "status", "complete",
            "fileId", metadata.getId(),
            "fileName", metadata.getOriginalFilename()));

    } catch (IOException e) {
        throw new RuntimeException("File processing failed", e);
    }
}


@DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        metadataService.hardDelete(id, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/ls")
    public ResponseEntity<FolderViewDto> listDirectory(
         @AuthenticationPrincipal User currentUser,
         @Nullable Long folderId) {

        FolderViewDto response = this.metadataService.listDirectory(currentUser.getId(), folderId);

        if (response == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(response);
    }
}