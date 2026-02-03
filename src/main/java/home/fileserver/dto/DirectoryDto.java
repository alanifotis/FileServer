package home.fileserver.dto;

import org.jspecify.annotations.Nullable;

public record DirectoryDto(
    String folderName,
    @Nullable Long parentId
) {}
