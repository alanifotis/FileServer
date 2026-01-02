package home.fileserver.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import home.fileserver.dto.FileItem;

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
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FileStorageService {

    private final Path rootLocation;
    // Locks to prevent two uploads writing to the same file at the exact same ms
    private final ConcurrentHashMap<String, Object> fileLocks = new ConcurrentHashMap<>();

    // We inject a path from application.properties, defaulting to "user-data"
    // folder
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
            Path userPath = this.rootLocation.resolve(String.valueOf(userId));

            if (!Files.exists(userPath)) {
                Files.createDirectories(userPath);
                Path userAvatarPath = userPath.resolve("avatar-icon");
                Files.createDirectories(userAvatarPath);
                System.out.println(
                        "Created root folder for user: " + userId + " at " + userPath + " & " + userAvatarPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for user " + userId, e);
        }
    }

    /**
     * The Main Method.
     * Handles renaming and saves the file.
     * Supports appending for resumability.
     */
    public String storeFile(Long userId, MultipartFile file, boolean isChunk, int chunkIndex) {
        // 1. Resolve User Folder
        Path userFolder = this.rootLocation.resolve(String.valueOf(userId));
        if (!Files.exists(userFolder))
            initUserRoot(userId);

        // 2. Sanitize Filename (Security)
        String originalFilename = Paths.get(file.getOriginalFilename()).getFileName().toString();

        // 3. Conflict Resolution (Only needed for the first chunk or whole file)
        String finalFilename = originalFilename;
        if (chunkIndex == 0) {
            finalFilename = resolveFileNameConflict(userFolder, originalFilename);
        }

        Path targetPath = userFolder.resolve(finalFilename);

        // 4. Write Logic (Synchronized for thread safety)
        // We lock based on the User+File combination
        String lockKey = userId + "_" + finalFilename;
        synchronized (fileLocks.computeIfAbsent(lockKey, k -> new Object())) {
            try (InputStream inputStream = file.getInputStream()) {
                if (isChunk && chunkIndex > 0) {
                    // APPEND mode for chunks 2, 3, 4...
                    Files.write(targetPath, inputStream.readAllBytes(), StandardOpenOption.APPEND);
                } else {
                    // CREATE mode for chunk 0 or whole file
                    Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
                }
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file " + finalFilename, e);
            } finally {
                // Clean up lock if upload is 'finished' (omitted for brevity, but good
                // practice)
                if (!isChunk)
                    fileLocks.remove(lockKey);
            }
        }

        return finalFilename;
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
            String newName = nameWithoutExt + " (" + counter + ")" + ext;
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

    public List<FileItem> listUserFiles(Long userId) {
        Path userFolder = this.rootLocation.resolve(String.valueOf(userId));

        // If folder doesn't exist yet (new user), return empty list
        if (!Files.exists(userFolder)) {
            return Collections.emptyList();
        }

        try (Stream<Path> stream = Files.list(userFolder)) {
            return stream
                    .map(path -> mapPathToFileItem(path))
                    // Sort: Folders first, then Files by date (newest first)
                    .sorted(Comparator.comparing(FileItem::isFolder).reversed()
                            .thenComparing(FileItem::lastUpdated).reversed())
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Failed to read user files", e);
        }
    }

    private FileItem mapPathToFileItem(Path path) {
        try {
            boolean isDir = Files.isDirectory(path);
            String name = path.getFileName().toString();

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
                    size = s.count() + " items";
                }
            } else {
                size = humanReadableByteCount(Files.size(path));
            }

            return new FileItem(name, type, size, lastUpdated, isDir);

        } catch (IOException e) {
            return new FileItem(path.getFileName().toString(), "unknown", "-", "-", false);
        }
    }

    // Helper: Get extension (e.g., "pdf")
    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot == -1)
            return "file";
        return filename.substring(lastDot + 1).toLowerCase();
    }

    // Helper: Convert bytes to KB/MB
    private String humanReadableByteCount(long bytes) {
        if (bytes < 1024)
            return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
}