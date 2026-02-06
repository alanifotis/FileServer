package home.fileserver.service;

import java.nio.file.Files;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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

    @Transactional
    public FileMetadata saveDirectoryMetadata(User user, DirectoryDto dto) {

        Optional<FileMetadata> existing = metaRepo.findByUserAndParentIdAndOriginalFilenameAndIsFolderTrue(
                user, dto.parentId(), dto.folderName());
        if (existing.isPresent()) {
            return existing.get();
        }

        FileCategory category = dto.folderName().equalsIgnoreCase("Home") ? FileCategory.HOME : FileCategory.FOLDER;

        return saveInternal(
                user,
                dto.parentId(),
                dto.folderName(),
                true,
                category,
                "inode/directory",
                null);
    }

    @Transactional
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

    private FileMetadata saveInternal(User user, Long parentId, String name, boolean isFolder, FileCategory category,
            String contentType, FileBlob blob) {
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
        if (parentId != null && !metaRepo.existsByIdAndUser(parentId, user)) {
            throw new IllegalArgumentException("Parent folder not found or access denied");
        }
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

    public FolderViewDto listDirectory(Long userId, Long folderId) {

        List<FileMetadata> rawFiles = this.metaRepo.listDirectory(userId, folderId);


        List<FolderDto> content = rawFiles.stream()
                .map(f ->  new FolderDto(
                            f.getId(),
                            f.getOriginalFilename(),
                            f.isFolder(),
                            (f.getBlob() != null) ? f.getBlob().getSizeInBytes() : 0L,
                            f.getUploadedAt()))
                .collect(Collectors.toList());

        List<BreadcrumbDto> path = new ArrayList<>();

        path.add(new BreadcrumbDto(null, "Home"));

        List<BreadcrumbDto> ancestors = folderId != null ? this.getPathToRoot(folderId) : Collections.emptyList();        

        path.addAll(ancestors);

        FolderViewDto response = new FolderViewDto(path, content);

        return response;
    }

    public List<BreadcrumbDto> getPathToRoot(Long folderId) {

        return jdbcClient.sql(PATH_TO_ROOT_QUERY)
                .param("folderId", folderId)
                .query(BreadcrumbDto.class)
                .list();
    }
}