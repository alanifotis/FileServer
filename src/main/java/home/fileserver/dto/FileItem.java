package home.fileserver.dto;

public record FileItem(String name,
        String type,
        String size,
        String lastUpdated,
        boolean isFolder
    ) {}
