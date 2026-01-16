package home.fileserver.dto;

import org.jspecify.annotations.Nullable;

public record FileMetadataDto(
    @Nullable String newOriginalName,
    @Nullable Long newParentId,
    @Nullable Boolean newIsTrashed,
    @Nullable Boolean newIsPublic
) {
}