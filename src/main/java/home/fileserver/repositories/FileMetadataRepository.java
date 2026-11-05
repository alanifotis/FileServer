package home.fileserver.repositories;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import home.fileserver.models.FileCategory;
import home.fileserver.models.FileMetadata;
import home.fileserver.models.User;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    List<FileMetadata> findByParentIdAndIsTrashedFalse(Long parentId);

    List<FileMetadata> findAllByParentId(Long parentId);

    List<FileMetadata> findByUser_IdAndCategoryAndIsTrashedFalse(Long userId, FileCategory category);

    List<FileMetadata> findByUser_IdAndOriginalFilenameContainingIgnoreCaseAndIsTrashedFalse(Long userId, String query);

    boolean existsByIdAndUser(Long id, User user);

    boolean existsByIdAndUserId(Long id, Long userId);

    @Query("SELECT m FROM FileMetadata m " +
            "WHERE m.user = :user " +
            "AND m.originalFilename = :originalFilename " +
            "AND m.isFolder = true " +
            "AND (:parentId IS NULL AND m.parentId IS NULL OR m.parentId = :parentId)")
    Optional<FileMetadata> findByUserAndParentIdAndOriginalFilenameAndIsFolderTrue(User user, @Nullable Long parentId,
            String originalFilename);

    @Query("SELECT DISTINCT m.originalFilename FROM FileMetadata m " +
            "WHERE m.user = :user " +
            "AND m.isTrashed = false " +
            "AND (:parentId IS NULL AND m.parentId IS NULL OR m.parentId = :parentId) " +
            "AND (m.originalFilename = :exactName OR m.originalFilename LIKE :pattern)")
    Set<String> findTakenNames(
            @Param("user") User user,
            @Nullable @Param("parentId") Long parentId,
            @Param("exactName") String exactName,
            @Param("pattern") String pattern);

    @Query("SELECT COUNT(m) > 0 FROM FileMetadata m " +
            "WHERE m.user = :user " +
            "AND m.originalFilename = :name " +
            "AND m.isTrashed = false " +
            "AND (:parentId IS NULL AND m.parentId IS NULL OR m.parentId = :parentId)")
    boolean existsInFolder(
            @Param("user") User user,
            @Param("name") String name,
            @Nullable @Param("parentId") Long parentId);

    @Query(nativeQuery = true, value = """
                WITH RECURSIVE ancestry AS (
                    SELECT id, parent_id
                    FROM file_metadata
                    WHERE id = :targetId
                    UNION ALL
                    SELECT f.id, f.parent_id
                    FROM file_metadata f
                    INNER JOIN ancestry a ON f.id = a.parent_id
                )
                SELECT COUNT(*) > 0
                FROM ancestry
                WHERE id = :sourceId
            """)
    boolean isAncestor(@Param("sourceId") Long sourceId, @Param("targetId") Long targetId);

    @Modifying
    @Query(nativeQuery = true, value = """
                WITH RECURSIVE tree AS (
                    SELECT id FROM file_metadata WHERE id = :rootId
                    UNION ALL
                    SELECT f.id FROM file_metadata f
                    INNER JOIN tree t ON f.parent_id = t.id
                )
                UPDATE file_metadata
                SET is_trashed = :trashed, updated_at = :now
                WHERE id IN (SELECT id FROM tree)
                  AND user_id = :userId
            """)
    void updateTrashedRecursive(
            @Param("rootId") Long rootId,
            @Param("trashed") boolean trashed,
            @Param("userId") Long userId,
            @Param("now") Instant now);

    @Query(nativeQuery = true, value = """
                WITH RECURSIVE tree AS (
                    SELECT id FROM file_metadata WHERE id = :rootId
                    UNION ALL
                    SELECT f.id FROM file_metadata f
                    INNER JOIN tree t ON f.parent_id = t.id
                )
                SELECT blob_id FROM file_metadata
                WHERE id IN (SELECT id FROM tree)
                  AND blob_id IS NOT NULL
                  AND user_id = :userId
            """)
    List<Long> findBlobIdsInTree(@Param("rootId") Long rootId, @Param("userId") Long userId);

    @Modifying
    @Query(nativeQuery = true, value = """
                WITH RECURSIVE tree AS (
                    SELECT id FROM file_metadata WHERE id = :rootId
                    UNION ALL
                    SELECT f.id FROM file_metadata f
                    INNER JOIN tree t ON f.parent_id = t.id
                )
                DELETE FROM file_metadata
                WHERE id IN (SELECT id FROM tree)
                  AND user_id = :userId
            """)
    void deleteRecursive(@Param("rootId") Long rootId, @Param("userId") Long userId);


  @Query(  "SELECT m FROM FileMetadata m " +
           "LEFT JOIN FETCH m.blob " +
           "WHERE m.user.id = :userId " +
           "AND m.isTrashed = false " +
           "AND m.category != 'HOME'" +
           "AND (:parentId IS NULL AND m.parentId IS NULL OR m.parentId = :parentId) " +
           "ORDER BY m.isFolder DESC, m.originalFilename ASC")
    List<FileMetadata> listDirectory(@Param("userId") Long userId, @Nullable @Param("parentId") Long parentId);

    @Query("SELECT f FROM FileMetadata f JOIN FETCH f.blob WHERE f.id = :id")
    Optional<FileMetadata> findByIdWithBlob(@Param("id") Long id);
}