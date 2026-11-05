package home.fileserver.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import home.fileserver.dto.FileItem;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class FileStorageService {

    private final Path rootLocation;
    // Locks to prevent two uploads writing to the same file at the exact same ms
    private final ConcurrentHashMap<String, Object> fileLocks = new ConcurrentHashMap<>();

    // We inject a path from application.properties, defaulting to "user-data"
    public FileStorageService(@Value("${app.storage.location:user-data}") String location) {
        // This ensures OS independence (Paths.get handles Windows vs Linux slashes)
        this.rootLocation = Paths.get(location).toAbsolutePath().normalize();

        try {
            // Creates the base "user-data" folder if it doesn't exist
            Files.createDirectories(this.rootLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not initialize storage location", ex);
        }
    }

    public void initUserRoot(Long userId) {
        try {
            // Resolve creates the path: user-data/{userId}
            Path userPath = getUserRootPath(userId);

            if (!Files.exists(userPath)) {
                Files.createDirectories(userPath);
                var avatarPath = getUserAvatarPath(userId);
                log.info("Created root folder for user: {} at {} & {}", userId, userPath, avatarPath);
                return;
            }

            log.info("Default directories are already created.");

        } catch (IOException e) {
            log.error("Could not initialize folder for user " + userId, e);
        }
    }

    /**
     * The Master Method.
     * 
     * @param forcedName If not null, the file will be renamed to this (plus
     *                   original extension).
     */
    private String storeFile(Path storePath, MultipartFile file, boolean isChunk, int chunkIndex, String forcedName) {

        Path originalFilename = Paths.get(file.getOriginalFilename()).getFileName();
        String finalFilename;

        // --- LOGIC CHANGE STARTS HERE ---

        if (forcedName != null && !forcedName.isBlank()) {
            // A. Avatar Mode: Force name + Keep Extension
            String extension = getFileExtension(originalFilename); // e.g., ".jpg"
            finalFilename = forcedName + extension; // e.g., "avatar.jpg"

            // Note: We normally SKIP conflict resolution here because we WANT to overwrite
            // the old avatar.
        } else {
            // B. Standard Mode: Use Original Name + Resolve Conflicts
            finalFilename = originalFilename.toString();
            if (chunkIndex == 0) {
                finalFilename = resolveFileNameConflict(storePath, originalFilename.toString());
            }
        }

        // --- LOGIC CHANGE ENDS HERE ---

        Path targetPath = storePath.resolve(finalFilename);

        // 4. Write Logic (Synchronized) - largely unchanged
        String lockKey = storePath + "_" + finalFilename;

        synchronized (fileLocks.computeIfAbsent(lockKey, k -> new Object())) {
            try (InputStream inputStream = file.getInputStream()) {
                if (isChunk && chunkIndex > 0) {
                    Files.write(targetPath, inputStream.readAllBytes(), StandardOpenOption.APPEND);
                } else {
                    Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
                }
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file " + finalFilename, e);
            } finally {
                if (!isChunk)
                    fileLocks.remove(lockKey);
            }
        }

        return finalFilename;
    }

    // 1. Existing method (For regular files) - No changes needed in your
    // Controller!
    public String storeFile(Path storePath, MultipartFile file, boolean isChunk, int chunkIndex) {
        // Pass 'null' to indicate we want to use the original filename
        return storeFile(storePath, file, isChunk, chunkIndex, null);
    }

    // 2. NEW Helper method (For Avatars) - Use this in your set-avatar Controller
    public String storeAvatar(Path storePath, MultipartFile file) {
        // We force the name "avatar". The logic below will append .jpg or .png
        // automatically
        return storeFile(storePath, file, false, 0, "avatar");
    }

    /**
     * Smart Renaming Logic
     * input: "resume.pdf" -> exists? -> returns "resume (1).pdf"
     */
    private String resolveFileNameConflict(Path dir, String originalName) {
        if (!Files.exists(dir.resolve(originalName))) {
            return originalName;
        }

        String nameWithoutExt = "";
        String ext = "";
        int dotIndex = originalName.lastIndexOf('.');

        if (dotIndex != -1) {
            nameWithoutExt = originalName.substring(0, dotIndex);
            ext = originalName.substring(dotIndex);
        } else {
            nameWithoutExt = originalName;
        }

        int counter = 1;
        while (true) {
            String newName = nameWithoutExt + "-(" + counter + ")" + ext;
            if (!Files.exists(dir.resolve(newName))) {
                return newName;
            }
            counter++;
        }
    }

    // Helper to get the path (we will need this later for uploading)
    public Path getUserRootPath(Long userId) {
        return this.rootLocation.resolve(String.valueOf(userId));
    }

    public Path getUserAvatarPath(Long userId) {
        return this.rootLocation
                .resolve(String.valueOf(userId))
                .resolve("avatar-icon");
    }

    public List<FileItem> listUserFiles(Long userId) {
        Path userFolder = this.rootLocation.resolve(String.valueOf(userId));

        // If folder doesn't exist yet (new user), return empty list
        if (!Files.exists(userFolder)) {
            return Collections.emptyList();
        }

        try (Stream<Path> stream = Files.list(userFolder)) {
            return stream
                    .map(this::mapPathToFileItem)
                    .sorted(Comparator
                    .comparing((FileItem item) -> Objects.requireNonNull(item).isFolder(), Comparator.reverseOrder())
                    .thenComparing((FileItem item) -> Objects.requireNonNull(item).lastUpdated(), Comparator.reverseOrder()))
                    .toList();
        } catch (IOException e) {
            throw new RuntimeException("Failed to read user files", e);
        }
    }

    private FileItem mapPathToFileItem(Path path) {
        try {
            boolean isDir = Files.isDirectory(path);
            Path name = path.getFileName();
            // 1. Determine Type
            String type = isDir ? "folder" : getFileExtension(name);

            // 2. Format Date (e.g., "2024-01-12")
            String lastUpdated = new SimpleDateFormat("yyyy-MM-dd")
                    .format(new Date(Files.getLastModifiedTime(path).toMillis()));

            // 3. Format Size
            String size;
            if (isDir) {
                // Optional: Count items inside if you want to be fancy, else just "-"
                try (Stream<Path> s = Files.list(path)) {
                    size = s.count() > 1 ? s.count() + " items" : s.count() + " item";
                }
            } else {
                size = humanReadableByteCount(Files.size(path));
            }

            return new FileItem(name.toString(), type, size, lastUpdated, isDir);

        } catch (IOException e) {
            return new FileItem(
                    path.getFileName().toString(),
                    "unknown",
                    "-",
                    "-",
                    false);
        }
    }

    // Helper: Get FILE extension.
    private String getFileExtension(Path path) {
        String fileName = path.getFileName().toString();
        int lastIndexOfDot = fileName.lastIndexOf('.');
        if (lastIndexOfDot == -1 || lastIndexOfDot == 0) {
            return "";
        }
        return fileName.substring(lastIndexOfDot + 1);
    }

    // Helper: Convert bytes to KB/MB
    private String humanReadableByteCount(long bytes) {
        if (bytes < 1024)
            return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }

    public Resource getAvatar(Long userId) {
        try {
            // 1. Get the path to the user's avatar folder
            // (Reuse your existing logic from fileStorageService)
            Path avatarFolder = this.getUserAvatarPath(userId);

            // 2. We forced the name "avatar" in your storeAvatar method,
            // but we don't know if it's .jpg, .png, etc.
            // We need to find the file that starts with "avatar".
            Path avatarFile = Files.list(avatarFolder)
                    .filter(path -> path.getFileName().toString().startsWith("avatar"))
                    .findFirst()
                    .orElse(null);

            if (avatarFile == null) {
                return null;
            }

            // 3. Create a Resource from the file path
            Resource resource = new UrlResource(avatarFile.toUri());

            if (resource.exists() && resource.isReadable()) {
                // 4. Determine Content-Type (e.g., image/jpeg)
                return resource;

            } else {
                return null;
            }

        } catch (Exception e) {
            log.error("An error occurred during avatar retrieval.", e);
            return null;
        }
    }
}