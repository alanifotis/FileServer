package home.fileserver.service.helper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.atomic.AtomicReference;

@Component
@Slf4j
public class ArchiveDriveLocator {

    private static final String MARKER_FILE_NAME = ".external_drive_uuid.sys";
    private static final long SCAN_COOLDOWN_MS = 5000; 

    @Value("${external.drive.uuid}")
    private String externalDriveUUID;

    @Value("${app.storage.location:user-data}")
    private String uploadPath;

    private final AtomicReference<Path> cachedDrivePath = new AtomicReference<>(null);
    private volatile long lastScanTime = 0;

    /**
     * Used by the Webhook to bypass the cooldown and strictly check the hardware right now.
     */
    public synchronized Path forceScanAndVerify() {
        Path currentPath = cachedDrivePath.get();
        
        if (currentPath != null && Files.exists(currentPath.resolve(MARKER_FILE_NAME))) {
            log.info("[HARDWARE] Archive drive is already active. Extraneous USB event ignored.");
            
            return currentPath;
        }

        log.info("[HARDWARE] Archive drive currently offline. Scanning new hardware...");
        lastScanTime = System.currentTimeMillis();
        return scanHardwareRoots();
    }

    /**
     * Used by the Download Service (getFile). Uses the cache for blazing fast reads,
     * and prevents OS scanning storms if the drive is unplugged.
     */
    public Path getVerifiedExternalRoot() {
        Path currentPath = cachedDrivePath.get();
        
        // Fast path: Cache exists and physical drive is still accessible
        if (currentPath != null && Files.exists(currentPath.resolve(MARKER_FILE_NAME))) {
            return currentPath;
        }

        // Throttled path: If drive is missing, only check the OS once every 5 seconds
        if (System.currentTimeMillis() - lastScanTime < SCAN_COOLDOWN_MS) {
            return cachedDrivePath.get(); 
        }

        // Only one thread gets to hit the OS scan if the cooldown has expired
        synchronized (this) {
            if (System.currentTimeMillis() - lastScanTime < SCAN_COOLDOWN_MS) {
                return cachedDrivePath.get();
            }
            lastScanTime = System.currentTimeMillis();
            return scanHardwareRoots();
        }
    }

    private Path scanHardwareRoots() {
        for (File root : File.listRoots()) {
            Path markerFile = root.toPath().resolve(MARKER_FILE_NAME);
            if (Files.exists(markerFile)) {
                try {
                    String content = Files.readString(markerFile).trim();
                    if (externalDriveUUID.equals(content)) {
                        Path verifiedRoot = root.toPath().resolve(this.uploadPath);
                        cachedDrivePath.set(verifiedRoot);
                        log.info("PATH: {}", verifiedRoot.toString());
                        return verifiedRoot;
                    }
                } catch (Exception ignored) {}
            }
        }
        cachedDrivePath.set(null);
        return null; 
    }
}