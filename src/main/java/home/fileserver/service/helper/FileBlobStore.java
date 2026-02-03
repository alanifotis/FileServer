package home.fileserver.service.helper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import home.fileserver.dto.StorageResultDto;
import home.fileserver.models.FileBlob;
import home.fileserver.repositories.FileBlobRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FileBlobStore {

    private final FileBlobRepository blobRepository;

    // Fast, read-only lookup
    @Transactional(readOnly = true)
    public Optional<FileBlob> findExactMatch(String hash, long size) {
        return blobRepository.findBySha256HashAndSizeInBytes(hash, size);
    }

    // ISOLATED INSERT: Runs in its own transaction.
    // If this fails, it rolls back ONLY this insert, not the caller.
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public FileBlob saveNew(StorageResultDto result) {
        FileBlob newBlob = FileBlob.builder()
                .sha256Hash(result.sha256Hash())
                .storagePath(result.storagePath())
                .sizeInBytes(result.sizeInBytes())
                .contentType(result.contentType())
                .refCount(1L)
                .build();

        return blobRepository.saveAndFlush(newBlob);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void incrementRefCount(Long id) {
        blobRepository.incrementRefCount(id);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<String> decrementAndCollectOrphans(List<Long> blobIds) {
        if (blobIds == null || blobIds.isEmpty()) return Collections.emptyList();

        Map<Long, Long> decrementCounts = blobIds.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        List<FileBlob> blobs = blobRepository.findAllById(decrementCounts.keySet());
        
        List<FileBlob> toUpdate = new ArrayList<>();
        List<FileBlob> toDelete = new ArrayList<>();
        List<String> orphanPaths = new ArrayList<>();

        for (FileBlob blob : blobs) {
            long countToRemove = decrementCounts.get(blob.getId());
            long newCount = blob.getRefCount() - countToRemove;

            if (newCount <= 0) {
                toDelete.add(blob);
                orphanPaths.add(blob.getStoragePath());
            } else {
                blob.setRefCount(newCount);
                toUpdate.add(blob);
            }
        }

        if (!toUpdate.isEmpty()) blobRepository.saveAll(toUpdate);
        if (!toDelete.isEmpty()) blobRepository.deleteAll(toDelete);

        return orphanPaths;
    }

}
