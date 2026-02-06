package home.fileserver.dto.files;

import java.time.Instant;

public record FolderDto (
    Long id, 
    String name, 
    boolean isFolder, 
    Long size, 
    Instant createdAt
) {}
