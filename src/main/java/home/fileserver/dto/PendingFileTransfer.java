package home.fileserver.dto;

public record PendingFileTransfer(
    Long id, 
    String storagePath, 
    String sha256Hash,
    Long originalUserId
) {}
