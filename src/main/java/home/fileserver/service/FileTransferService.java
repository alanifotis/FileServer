package home.fileserver.service;

import home.fileserver.dto.PendingFileTransfer;
import home.fileserver.models.StorageLocation;
import home.fileserver.repositories.FileBlobSyncRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.BufferedInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.security.DigestOutputStream;
import java.security.MessageDigest;

@Service
@RequiredArgsConstructor
public class FileTransferService {

    private final FileBlobSyncRepository syncRepository;
    
    @Value("${app.storage.location:C:/Users/alanis/Java/FileServer/user-data}")
    private String localUploadRoot;

    private static final int BUFFER_SIZE = 64 * 1024; 
    
    private static final long THROTTLE_BYTES = 10 * 1024 * 1024;

    @Async
    public boolean safelyTransferFile(PendingFileTransfer fileData, Path externalDriveRoot) {
        
        String relativePath = fileData.originalUserId() + "/" + fileData.storagePath();
        Path sourcePath = Paths.get(localUploadRoot, relativePath).normalize();
        Path targetPath = externalDriveRoot.resolve(relativePath).normalize();

        try {
            if (!Files.exists(sourcePath)) {
                System.err.println("[SYNC WARN] Physical file missing for Blob ID " + fileData.id());
                return false; 
            }

            Files.createDirectories(targetPath.getParent());

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            
            try (InputStream is = new BufferedInputStream(Files.newInputStream(sourcePath));
                 OutputStream os = Files.newOutputStream(targetPath, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
                 DigestOutputStream dos = new DigestOutputStream(os, digest)) {

                byte[] buffer = new byte[BUFFER_SIZE];
                int bytesRead;
                long bytesSinceLastYield = 0;

                while ((bytesRead = is.read(buffer)) != -1) {
                    dos.write(buffer, 0, bytesRead);
                    bytesSinceLastYield += bytesRead;

                    if (bytesSinceLastYield >= THROTTLE_BYTES) {
                        bytesSinceLastYield = 0;
                        Thread.sleep(5); 
                    }
                }
            }

            String newHash = bytesToHex(digest.digest());
            
            if (!newHash.equalsIgnoreCase(fileData.sha256Hash())) {
                System.err.println("[SYNC ERROR] Hash mismatch for Blob ID " + fileData.id());
                Files.deleteIfExists(targetPath);
                return false;
            }

            int rowsUpdated = syncRepository.markAsTransferred(fileData.id(), StorageLocation.EXTERNAL_DRIVE_1TB);

            if (rowsUpdated > 0) {
                Files.deleteIfExists(sourcePath);
                return true;
            }

        } catch (Exception e) {
            System.err.println("[SYNC ERROR] Exception during transfer of Blob ID " + fileData.id() + ": " + e.getMessage());
            try { Files.deleteIfExists(targetPath); } catch (Exception _) { return false; }
        }
        return false;
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}