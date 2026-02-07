package home.fileserver.service;

import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import home.fileserver.dto.BlobUploadResult;
import home.fileserver.dto.StorageResultDto;
import home.fileserver.models.FileBlob;
import home.fileserver.service.helper.FileBlobTransactionalHelper;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileBlobService {

    private final LocalFileStorageService storageService;
    private final FileBlobTransactionalHelper blobStore;

    public BlobUploadResult uploadChunk(InputStream dataStream, String uploadId, int chunkIndex, boolean isLastChunk, String originalFileName, long userID) {

        String storageName = (uploadId != null && !uploadId.isBlank())
                ? uploadId
                : UUID.randomUUID().toString();
        
        String fileExtension = getFileExtension(originalFileName);

        boolean append = (chunkIndex > 0);

        StorageResultDto result = storageService.store(dataStream, storageName + fileExtension, append, isLastChunk, userID);

        if (!isLastChunk) {
            return new BlobUploadResult(false, storageName, null, null);
        }

        try {
            FileBlob finalBlob = resolveBlobInDatabase(result);
            return new BlobUploadResult(true, storageName, finalBlob, result.contentType());

        } catch (Exception e) {
            storageService.delete(result.storagePath());
            throw e;
        }
    }

    protected FileBlob resolveBlobInDatabase(StorageResultDto result) {

        var existingOpt = blobStore.findExactMatch(result.sha256Hash(), result.sizeInBytes());

        if (existingOpt.isPresent()) {
            return handleDuplicate(existingOpt.get(), result.storagePath());
        }

        try {
            return blobStore.saveNew(result);

        } catch (DataIntegrityViolationException e) {

            storageService.delete(result.storagePath());

            FileBlob winner = blobStore.findExactMatch(result.sha256Hash(), result.sizeInBytes())
                    .orElseThrow(() -> new RuntimeException("Concurrent upload race condition: Winner missing."));

            blobStore.incrementRefCount(winner.getId());

            winner.setRefCount(winner.getRefCount() + 1);
            return winner;
        }
    }

    private FileBlob handleDuplicate(FileBlob existing, String tempFilePath) {
        storageService.delete(tempFilePath);
        blobStore.incrementRefCount(existing.getId());
        existing.setRefCount(existing.getRefCount() + 1);
        return existing;
    }

    public void performCleanup(List<Long> blobIds) {
        if (blobIds == null || blobIds.isEmpty())
            return;

        List<String> orphans = blobStore.decrementAndCollectOrphans(blobIds);

        storageService.deleteBatch(orphans);
    }

    private String getFileExtension(String fileName) {
        int lastIndexOfDot = fileName.lastIndexOf('.');
        if (lastIndexOfDot == -1 || lastIndexOfDot == 0) {
            return "";
        }
        return fileName.substring(lastIndexOfDot);
    }
}