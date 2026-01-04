package home.fileserver.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import home.fileserver.models.FileMetadata;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    List<FileMetadata> findByParentIdAndIsTrashedFalse(Long parentId);

    List<FileMetadata> findByOwnerIdAndOriginalFilenameContainingIgnoreCaseAndIsTrashedFalse(
        Long ownerId, String query
    );
}
