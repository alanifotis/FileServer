package home.fileserver.dto;

import home.fileserver.models.FileBlob;

public record BlobUploadResult(
    boolean isComplete,       // true = FileBlob is ready. false = Continue uploading.
    String tempStorageId,     // The UUID used for stop, resume chunk trunsfer
    FileBlob fileBlob,         // Non-null ONLY if isComplete == true
    String detectedContentType // Result of tika detect for content type.
) {}
