package home.fileserver.dto;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.web.multipart.MultipartFile;

public record FileUploadRequest(
    @NonNull MultipartFile file,
    @Nullable Long parentId,
    @Nullable String uploadId,
    @Nullable Integer chunkIndex,
    @Nullable Integer totalChunks
) {
    public FileUploadRequest {
        if (chunkIndex == null) chunkIndex = 0;
        if (totalChunks == null) totalChunks = 1;
    }

    public boolean isLastChunk() {
        return (chunkIndex + 1) >= totalChunks;
    }
}