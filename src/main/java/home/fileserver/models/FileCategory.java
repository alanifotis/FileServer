package home.fileserver.models;

import java.util.Set;

public enum FileCategory {
    IMAGE,
    VIDEO,
    AUDIO,
    DOCUMENT,
    ARCHIVE,
    CODE,
    BINARY,
    FOLDER,
    HOME,
    UNKNOWN;

    private static final Set<String> DOCUMENT_MIMES = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
            "text/plain", "text/csv", "text/rtf", "application/rtf");

    private static final Set<String> CODE_EXTENSIONS = Set.of(
            "java", "js", "ts", "py", "c", "cpp", "h", "cs", "php", "rb", "go", "rs",
            "swift", "html", "css", "scss", "json", "xml", "yaml", "yml", "sql", "sh", "bat", "dockerfile");

    private static final Set<String> ARCHIVE_MIMES = Set.of(
            "application/zip", "application/x-rar-compressed", "application/x-7z-compressed",
            "application/x-tar", "application/gzip", "application/java-archive");

    public static FileCategory classify(String mimeType, String originalFilename) {
        if (mimeType == null)
            return UNKNOWN;

        String mime = mimeType.toLowerCase();
        String ext = "";

        if (originalFilename != null && originalFilename.startsWith(".")) {
            return CODE;
        }

        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        }

        if (mime.startsWith("image/"))
            return IMAGE;
        if (mime.startsWith("video/"))
            return VIDEO;
        if (mime.startsWith("audio/"))
            return AUDIO;

        if (CODE_EXTENSIONS.contains(ext) || (mime.contains("javascript") || mime.contains("json")
                || mime.contains("xml") || mime.contains("html"))) {
            return CODE;
        }

        if (DOCUMENT_MIMES.contains(mime)) {
            return DOCUMENT;
        }

        if (ARCHIVE_MIMES.contains(mime)) {
            return ARCHIVE;
        }

        if (mime.equals("application/octet-stream")) {
            if (ext.equals("pdf"))
                return DOCUMENT;
            if (ext.equals("zip"))
                return ARCHIVE;
        }

        return BINARY;
    }
}