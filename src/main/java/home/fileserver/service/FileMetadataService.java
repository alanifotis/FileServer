package home.fileserver.service;

import java.nio.file.Files;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.jspecify.annotations.Nullable;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import home.fileserver.dto.DirectoryDto;
import home.fileserver.dto.FileMetadataDto;
import home.fileserver.dto.files.BreadcrumbDto;
import home.fileserver.dto.files.FolderDto;
import home.fileserver.dto.files.FolderViewDto;
import home.fileserver.models.FileBlob;
import home.fileserver.models.FileCategory;
import home.fileserver.models.FileMetadata;
import home.fileserver.models.User;
import home.fileserver.repositories.FileMetadataRepository;
import home.fileserver.utilities.Snowflake;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileMetadataService {

    private static final DateTimeFormatter dateFormater = DateTimeFormatter.ISO_LOCAL_DATE
            .withZone(ZoneId.systemDefault());

    private static final String PATH_TO_ROOT_QUERY = """
            WITH RECURSIVE ancestry AS (
                SELECT m.id, m.original_filename, m.parent_id, 0 AS lvl
                FROM file_metadata m
                WHERE m.id = :folderId
                UNION ALL
                SELECT f.id, f.original_filename, f.parent_id, a.lvl + 1
                FROM file_metadata f
                INNER JOIN ancestry a ON f.id = a.parent_id
            )
            SELECT a.id, a.original_filename AS name
            FROM ancestry a
            ORDER BY a.lvl DESC;
                """;

    private final LocalFileStorageService localFileStorageService;
    private final FileMetadataRepository metaRepo;
    private final FileBlobService blobService;
    private final JdbcClient jdbcClient;
    private final Snowflake snowflake = Snowflake.getInstance();
    private final java.util.concurrent.ConcurrentMap<String, Object> folderLocks = new java.util.concurrent.ConcurrentHashMap<>();

    public FileMetadata saveDirectoryMetadata(User user, DirectoryDto dto) {

        String lockKey = user.getId() + ":" + dto.parentId() + ":" + dto.folderName();
        Object lock = folderLocks.computeIfAbsent(lockKey, k -> new Object());

        synchronized (lock) {
            try {

                return metaRepo.findByUserAndParentIdAndOriginalFilenameAndIsFolderTrue(
                        user, dto.parentId(), dto.folderName())
                    .orElseGet(() -> {
                        FileCategory category = dto.folderName().equalsIgnoreCase("Home") 
                            ? FileCategory.HOME : FileCategory.FOLDER;
                        
                        return saveInternal(user, dto.parentId(), dto.folderName(), true, category, "inode/directory", null);
                    });
            } finally {
                folderLocks.remove(lockKey, lock);
            }
        }
    }

    public FileMetadata saveFileMetadata(User user, FileBlob blob, String fileName, String contentType,
            @Nullable Long parentId) {

        String finalName = resolveDuplicateName(user, fileName, parentId);

        FileCategory category = FileCategory.classify(contentType, fileName);

        return saveInternal(
                user,
                parentId,
                finalName,
                false,
                category == null ? FileCategory.UNKNOWN : category,
                contentType,
                blob);
    }

    @Transactional
    public FileMetadata updateFileMetadata(Long id, FileMetadataDto dto, User user) {
        validateParent(user, id);

        FileMetadata entity = this.metaRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("File not found: " + id));

        if (!user.getId().equals(entity.getUser().getId())) {
            throw new AccessDeniedException("Access denied.");
        }

        Long targetParentId = (dto.newParentId() != null) ? dto.newParentId() : entity.getParentId();

        String targetName = (dto.newOriginalName() != null && !dto.newOriginalName().isBlank())
                ? dto.newOriginalName().trim()
                : entity.getOriginalFilename();

        boolean isMove = !Objects.equals(entity.getParentId(), targetParentId);
        boolean isRename = !targetName.equals(entity.getOriginalFilename());

        if (!isMove && !isRename) {
            return entity;
        }

        if (isMove) {
            if (entity.isFolder() && isCircularMove(entity.getId(), targetParentId)) {
                throw new IllegalArgumentException("Cannot move a folder into itself or its children.");
            }
        }

        if (metaRepo.existsInFolder(user, targetName, targetParentId)) {
            // throw new IllegalArgumentException("A file named '" + targetName + "' already
            // exists in the destination.");
            targetName = resolveDuplicateName(user, targetName, targetParentId);
        }

        entity.setParentId(targetParentId);
        entity.setOriginalFilename(targetName);
        entity.setUpdatedAt(Instant.now());

        return this.metaRepo.save(entity);
    }

    @Transactional
    private FileMetadata saveInternal(User user, Long parentId, String name, boolean isFolder, FileCategory category,
            String contentType, FileBlob blob) {

        if (parentId != null && parentId.equals(user.getId())) {
            parentId = null;
        }
        
        // Debug
        // if (parentId != null) {
        //     log.info("Validating Subfolder. ParentID: {}, UserID: {}", parentId, user.getId());
        // }

        validateParent(user, parentId);

        var meta = FileMetadata.builder()
                .id(this.snowflake.nextId())
                .user(user)
                .parentId(parentId)
                .originalFilename(name)
                .isFolder(isFolder)
                .category(category)
                .contentType(contentType)
                .blob(blob)
                .isPublic(false)
                .isTrashed(false)
                .updatedAt(Instant.now())
                .build();

        return this.metaRepo.save(meta);
    }

    private String resolveDuplicateName(User user, String originalName, @Nullable Long parentId) {
        int dotIndex = originalName.lastIndexOf(".");
        String namePart = (dotIndex > 0) ? originalName.substring(0, dotIndex) : originalName;
        String extPart = (dotIndex > 0) ? originalName.substring(dotIndex) : "";
        String pattern = namePart + " (%)" + extPart;

        Set<String> takenNames = metaRepo.findTakenNames(user, parentId, originalName, pattern);

        if (!takenNames.contains(originalName))
            return originalName;

        for (int i = 1; i <= 1000; i++) {
            String candidate = String.format("%s (%04d)%s", namePart, i, extPart);
            if (!takenNames.contains(candidate))
                return candidate;
        }
        throw new IllegalStateException("Too many duplicates for file: " + originalName);
    }

    private void validateParent(User user, @Nullable Long parentId) {

        if (parentId == null)
            return;

        if (parentId.equals(user.getId())) {
            return;
        }

        if (parentId != null && !this.metaRepo.existsByIdAndUser(parentId, user)) {
            throw new IllegalArgumentException("Parent folder not found.");
        }
    }

    public boolean validateOwnerShip(@Nullable Long parentId, Long userId) {
        return metaRepo.existsByIdAndUserId(parentId, userId);
    }

    private boolean isCircularMove(Long sourceId, Long targetParentId) {
        if (targetParentId == null)
            return false;

        if (sourceId.equals(targetParentId))
            return true;

        return metaRepo.isAncestor(sourceId, targetParentId);
    }

    @Transactional
    public void softDelete(Long id, boolean trashed, User user) {
        validateParent(user, id);
        metaRepo.updateTrashedRecursive(id, trashed, user.getId(), Instant.now());
    }

    @Transactional
    public void hardDelete(Long id, User user) {
        validateParent(user, id);

        List<Long> blobIdsInTree = metaRepo.findBlobIdsInTree(id, user.getId());

        metaRepo.deleteRecursive(id, user.getId());

        if (!blobIdsInTree.isEmpty()) {
            blobService.performCleanup(blobIdsInTree);
        }
    }

    FileMetadata instantiateRootDirectoryAndMetadata(User user) {
        if (!Files.exists(this.localFileStorageService.getUserRootPath(user.getId()))) {
            this.localFileStorageService.initUserRootDirectory(user.getId());
        }

        return this.metaRepo.findById(user.getId())
                .orElse(this.saveDirectoryMetadata(user, new DirectoryDto("Home", null)));
    }

    @Transactional(readOnly = true)
    public FolderViewDto listDirectory(Long userId, Long folderId) {

        if (folderId != null && userId.equals(folderId)) {
            folderId = null;
        }

        List<FileMetadata> rawFiles = this.metaRepo.listDirectory(userId, folderId);

        List<FolderDto> content = rawFiles.stream()
                .map(f -> new FolderDto(
                        f.getId(),
                        f.getOriginalFilename(),
                        f.isFolder(),
                        (f.getBlob() != null) ? f.getBlob().getSizeInBytes() : 0L,
                        dateFormater.format(f.getUploadedAt())))
                .collect(Collectors.toList());

        List<BreadcrumbDto> path;

        if (folderId != null) {
            List<BreadcrumbDto> records = this.getPathToRoot(folderId);

            path = records.stream()
                    .map(rec -> new BreadcrumbDto(rec.id(), rec.name()))
                    .collect(Collectors.toList());
        } else {
            path = new ArrayList<>();
            path.add(new BreadcrumbDto(null, "Home"));
        }

        return new FolderViewDto(path, content);
    }

    public List<BreadcrumbDto> getPathToRoot(Long folderId) {

        return jdbcClient.sql(PATH_TO_ROOT_QUERY)
                .param("folderId", folderId)
                .query(BreadcrumbDto.class)
                .list();
    }
}