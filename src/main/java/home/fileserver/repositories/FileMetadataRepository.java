package home.fileserver.repositories;

import java.util.List;
import java.util.Set;

import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import home.fileserver.models.FileCategory;
import home.fileserver.models.FileMetadata;
import home.fileserver.models.User;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    List<FileMetadata> findByParentIdAndIsTrashedFalse(Long parentId);

    List<FileMetadata> findByUser_IdAndCategoryAndIsTrashedFalse(Long userId, FileCategory category);

    List<FileMetadata> findByUser_IdAndOriginalFilenameContainingIgnoreCaseAndIsTrashedFalse(
            Long userId, String query);

    @Query("SELECT DISTINCT m.originalFilename FROM FileMetadata m " +
            "WHERE m.user = :user " +
            "AND m.isTrashed = false " +
            "AND (:parentId IS NULL AND m.parentId IS NULL OR m.parentId = :parentId) " +
            "AND (m.originalFilename = :exactName OR m.originalFilename LIKE :pattern)")
    Set<String> findTakenNames(
        @Param("user") User user,
            @Nullable @Param("parentId") Long parentId,
            @Param("exactName") String exactName,
            @Param("pattern") String pattern
        );

    boolean existsByIdAndUser(Long id, User user);

    @Query("SELECT COUNT(m) > 0 FROM FileMetadata m " +
            "WHERE m.user = :user " +
            "AND m.originalFilename = :name " +
            "AND m.isTrashed = false " +
            "AND (:parentId IS NULL AND m.parentId IS NULL OR m.parentId = :parentId)")
    boolean existsInFolder(
        @Param("user") User user,
        @Param("name") String name,
        @Nullable @Param("parentId") Long parentId
    );
}
