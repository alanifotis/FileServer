package home.fileserver.service;

import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import home.fileserver.dto.StorageResultDto;
import home.fileserver.exceptions.FileStorageException;
import home.fileserver.exceptions.FileWriteException;
import home.fileserver.exceptions.InvalidFilePathException;
import lombok.extern.slf4j.Slf4j;

import java.io.*;
import java.nio.file.*;
import java.security.DigestOutputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.regex.Pattern;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Service
@Slf4j
public class LocalFileStorageService {

    private final Path rootLocation;
    private final Tika tika;

    private static final int LOCK_POOL_SIZE = 128;
    private final Lock[] fileLocks;

    private static final Pattern SAFE_FILENAME = Pattern.compile("^[a-zA-Z0-9._-]+$");

    public LocalFileStorageService(@Value("${app.storage.location:user-data}") String location, Tika tika) {
        this.tika = tika;
        this.rootLocation = Paths.get(location).toAbsolutePath().normalize();

        this.fileLocks = new Lock[LOCK_POOL_SIZE];
        for (int i = 0; i < LOCK_POOL_SIZE; i++) {
            this.fileLocks[i] = new ReentrantLock();
        }

        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new FileStorageException("Could not initialize storage location", e);
        }
    }

    public StorageResultDto store(InputStream inputStream, String storageFilename, boolean append,
            boolean isLastChunk, long userId) {
        if (!SAFE_FILENAME.matcher(storageFilename).matches()) {
            throw new InvalidFilePathException("Invalid filename format: " + storageFilename);
        }

        Path finalDestination = this.rootLocation
                .resolve(getUserRootPath(userId))
                .resolve(storageFilename)
                .normalize();

        if (!finalDestination.startsWith(this.rootLocation)) {
            throw new InvalidFilePathException("Attempted path traversal detected");
        }

        Path tempFile = this.rootLocation
                .resolve(getUserRootPath(userId))
                .resolve(storageFilename + ".tmp");

        Lock lock = getLock(storageFilename);

        lock.lock();

        try {
            MessageDigest writeDigest = null;
            if (!append) {
                writeDigest = MessageDigest.getInstance("SHA-256");
            }

            OpenOption[] options = append
                    ? new OpenOption[] { StandardOpenOption.CREATE, StandardOpenOption.APPEND }
                    : new OpenOption[] { StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING };

            try (OutputStream fileOut = Files.newOutputStream(tempFile, options);
                    OutputStream out = (writeDigest != null) ? new DigestOutputStream(fileOut, writeDigest) : fileOut;
                    InputStream in = new BufferedInputStream(inputStream)) { in.transferTo(out); }

            if (!isLastChunk) {
                return new StorageResultDto(storageFilename, null, null, Files.size(tempFile));
            }

            String hexHash;
            long size = Files.size(tempFile);

            if (writeDigest != null) {
                hexHash = HexFormat.of().formatHex(writeDigest.digest());
            } else {
                hexHash = calculateHashFromDisk(tempFile);
            }

            String contentType = tika.detect(tempFile);

            Files.move(tempFile, finalDestination, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);

            return new StorageResultDto(storageFilename, hexHash, contentType, size);

        } catch (IOException | NoSuchAlgorithmException e) {
            try {
                Files.deleteIfExists(tempFile);
            } catch (IOException _) {
            }
            throw new FileWriteException("Failed to store file: " + storageFilename, e);
        } finally {
            lock.unlock();
        }
    }

    private String calculateHashFromDisk(Path path) throws IOException, NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        try (InputStream fis = Files.newInputStream(path);
                InputStream bis = new BufferedInputStream(fis);
                DigestOutputStream dos = new DigestOutputStream(OutputStream.nullOutputStream(), digest)) {
            bis.transferTo(dos);
        }
        return HexFormat.of().formatHex(digest.digest());
    }

    private Lock getLock(String filename) {
        int hash = filename.hashCode();
        int index = Math.abs(hash) % LOCK_POOL_SIZE;
        return fileLocks[index];
    }

    public void delete(String storagePath) {
        if (storagePath == null || !SAFE_FILENAME.matcher(storagePath).matches())
            return;

        Lock lock = getLock(storagePath);
        lock.lock();
        try {
            Path targetFile = this.rootLocation.resolve(storagePath).normalize();
            Files.deleteIfExists(targetFile);
            Files.deleteIfExists(rootLocation.resolve(storagePath + ".tmp"));
        } catch (IOException ignored) {
        } finally {
            lock.unlock();
        }
    }

    public void deleteBatch(List<String> storagePaths) {
        if (storagePaths == null || storagePaths.isEmpty())
            return;

        storagePaths.parallelStream().forEach(this::delete);
    }

    public void initUserRootDirectory(Long userId) {
        try {
            // Resolve creates the path: user-data/{userId}
            Path userPath = getUserRootPath(userId);

            if (!Files.exists(userPath)) {
                var avatarPath = getUserAvatarPath(userId);
                Files.createDirectories(avatarPath);

                log.info("Created root folder for user: {} at {} & {}", userId, userPath, avatarPath);
                return;
            }

            log.info("Default directories are already created.");

        } catch (IOException e) {
            log.error("Could not initialize folder for user " + userId, e);
        }
    }

    public Path getUserRootPath(Long userId) {
        return this.rootLocation.resolve(String.valueOf(userId));
    }

    public Path getUserAvatarPath(Long userId) {
        return this.rootLocation
                .resolve(String.valueOf(userId))
                .resolve("avatar-icon");
    }
}