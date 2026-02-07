package home.fileserver.dto.files;

import com.fasterxml.jackson.annotation.JsonFormat;

public record FolderDto (
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    Long id, 
    String name, 
    boolean isFolder, 
    Long size, 
    String createdAt
) {}
