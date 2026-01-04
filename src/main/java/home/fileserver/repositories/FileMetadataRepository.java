package home.fileserver.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import home.fileserver.models.FileCategory;
import home.fileserver.models.FileMetadata;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    List<FileMetadata> findByParentIdAndIsTrashedFalse(Long parentId);

    List<FileMetadata> findByUser_IdAndCategoryAndIsTrashedFalse(Long userId, FileCategory category);

    List<FileMetadata> findByUser_IdAndOriginalFilenameContainingIgnoreCaseAndIsTrashedFalse(
        Long userId, String query
    );
}
