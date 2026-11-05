package home.fileserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import home.fileserver.models.FileBlob;

public interface FileBlobRepository extends JpaRepository<FileBlob, Long> {
    
    Optional<FileBlob> findBySha256HashAndSizeInBytes(String sha256Hash, long sizeInBytes);
    List<FileBlob> findByRefCountLessThanEqual(long count);

    @Modifying
    @Query("UPDATE FileBlob b SET b.refCount = b.refCount + 1 WHERE b.id = :id")
    void incrementRefCount(Long id);
}