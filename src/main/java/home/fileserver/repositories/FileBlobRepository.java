package home.fileserver.repositories;

import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import home.fileserver.models.FileBlob;

@Repository
public interface FileBlobRepository extends JpaRepository<FileBlob, Long> {
    
    @Nullable FileBlob findBySha256HashAndSizeInBytes(String sha256Hash, long sizeInBytes);
    List<FileBlob> findByRefCountLessThanEqual(long count);
}