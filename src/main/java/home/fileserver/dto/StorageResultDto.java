package home.fileserver.dto;

import org.jspecify.annotations.Nullable;

public record StorageResultDto(
    @Nullable String storagePath,
    @Nullable String sha256Hash,
    @Nullable String contentType,
    @Nullable Long sizeInBytes
) {}
