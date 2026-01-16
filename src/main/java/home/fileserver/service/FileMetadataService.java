package home.fileserver.service;

import java.time.Instant;
import java.util.Set;

import org.jspecify.annotations.Nullable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import home.fileserver.dto.FileMetadataDto;
import home.fileserver.models.FileBlob;
import home.fileserver.models.FileCategory;
import home.fileserver.models.FileMetadata;
import home.fileserver.models.User;
import home.fileserver.repositories.FileMetadataRepository;
import home.fileserver.utilities.Snowflake;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class FileMetadataService {
    private final FileMetadataRepository metaRepo;
    private final Snowflake snowflake = Snowflake.getInstance();

    public FileMetadataService(FileMetadataRepository metaRepo) {
        this.metaRepo = metaRepo;
    }

    @Transactional
    public FileMetadata saveDirectoryMetadata(
            User user,
            String folderName,
            @Nullable Long parentId,
            @Nullable FileCategory category) {
        var meta = baseMetadata(user, folderName, parentId)
                .isFolder(true)
                .category(category == null ? FileCategory.FOLDER : category)
                .blob(null)
                .contentType("inode/directory")
                .build();
        return this.metaRepo.save(meta);
    }

    @Transactional
    public FileMetadata saveFileMetadata(
            User user,
            FileBlob blob,
            String fileName,
            String contentType,
            @Nullable Long parentId) {

        FileCategory category = FileCategory.classify(contentType, fileName);
        var meta = baseMetadata(user, fileName, parentId)
                .isFolder(false)
                .category(category == null ? FileCategory.UNKNOWN : category)
                .blob(blob)
                .contentType(contentType)
                .build();

        return this.metaRepo.save(meta);

    }

    private FileMetadata.FileMetadataBuilder baseMetadata(User user, String originalName, @Nullable Long parentId) {
        validateParent(user, parentId);
        return FileMetadata.builder()
                .user(user)
                .id(this.snowflake.nextId())
                .originalFilename(resolveDuplicateName(user, originalName, parentId))
                .parentId(parentId)
                .isPublic(false)
                .isTrashed(false)
                .updatedAt(Instant.now());
    }

    private String resolveDuplicateName(User user, String originalName, @Nullable Long parentId) {

        int dotIndex = originalName.lastIndexOf(".");
        String namePart, extPart;

        if (dotIndex > 0) {
            namePart = originalName.substring(0, dotIndex);
            extPart = originalName.substring(dotIndex);
        } else {
            namePart = originalName;
            extPart = "";
        }

        String pattern = namePart + " (%)" + extPart;

        Set<String> takenNames = metaRepo.findTakenNames(user, parentId, originalName, pattern);

        if (!takenNames.contains(originalName)) {
            return originalName;
        }

        int counter = 1;
        while (true) {
            String candidate = String.format("%s (%d)%s", namePart, counter, extPart);
            if (!takenNames.contains(candidate)) {
                return candidate;
            }
            counter++;

            // Safety Break
            if (counter > 1000)
                throw new IllegalStateException("Too many duplicates");
        }
    }

    private void validateParent(User user, @Nullable Long parentId) {
        if (parentId == null)
            return;

        boolean parentExists = metaRepo.existsByIdAndUser(parentId, user);
        if (!parentExists) {
            throw new IllegalArgumentException("Parent folder not found or access denied");
        }
    }

    public FileMetadata updateFileMetadata(Long originalId, FileMetadataDto metadataDto, User authenticatedUser) {
        FileMetadata entity = this.metaRepo.findById(originalId)
                .orElseThrow(
                        () -> new EntityNotFoundException("No FileMetadata found with the provided ID: " + originalId));

        entity.setOriginalFilename(renameOriginalLogic(metadataDto.newOriginalName(), entity,metadataDto.newParentId(), authenticatedUser));

        if (authenticatedUser.getId().equals(entity.getUser().getId())) {
            throw new AccessDeniedException("Access denied.");
        }

        return this.metaRepo.save(entity);
    }

    private String renameOriginalLogic(@Nullable String dtoNewName, FileMetadata entity, @Nullable Long dtoId, User user) {
        if (dtoNewName == null || dtoNewName.isBlank()) {
            log.info("No rename necessary.");
            return entity.getOriginalFilename();
        }

        String newName = dtoNewName.trim();

        if (entity.getOriginalFilename().equals(newName)) {
            log.info("No rename necessary.");
            return entity.getOriginalFilename();
        }

        Long targetParent = (dtoId != null) ? dtoId : entity.getParentId();

        if (metaRepo.existsInFolder(user, newName, targetParent)) {
                    throw new IllegalArgumentException("A file with this name already exists in the destination.");
        }

        if (entity.isFolder()) {
            return newName;
        }

        return "";

    }
}
