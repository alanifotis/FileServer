package home.fileserver.models;

import java.util.Set;

public enum FileCategory {
    FOLDER("Folder"),
    IMAGE("Image"),
    VIDEO("Video"),
    AUDIO("Audio"),
    DOCUMENT("Document"),
    SPREADSHEET("Spreadsheet"),
    PRESENTATION("Presentation"),
    ARCHIVE("Archive"),
    CODE("Code"),
    HOME("Home"),
    UNKNOWN("Unknown");

    private final String displayName;

    FileCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    // --- STATIC SETS (From your original code + additions) ---
    private static final Set<String> CODE_EXTENSIONS = Set.of(
            "java", "js", "ts", "py", "c", "cpp", "h", "cs", "php", "rb", "go", "rs",
            "swift", "html", "css", "scss", "json", "xml", "yaml", "yml", "sql", "sh", "bat", "dockerfile",
            "kt", "gradle", "properties", "env"
    );

    // --- ROBUST CLASSIFIER ---
    public static FileCategory classify(String mimeType, String filename) {
        if (mimeType == null) mimeType = "";
        if (filename == null) filename = "";

        String mime = mimeType.toLowerCase();
        String ext = getExtension(filename).toLowerCase();

        if (CODE_EXTENSIONS.contains(ext)) {
            return CODE;
        }

        if (mime.startsWith("image/")) return IMAGE;
        if (mime.startsWith("video/")) return VIDEO;
        if (mime.startsWith("audio/")) return AUDIO;

        if (mime.contains("pdf")) return DOCUMENT;
        
        if (mime.contains("spreadsheet") || mime.contains("excel") || mime.contains("csv") || mime.equals("text/csv")) {
            return SPREADSHEET;
        }

        if (mime.contains("presentation") || mime.contains("powerpoint") || mime.contains("show")) {
            return PRESENTATION;
        }

        if (mime.contains("word") || mime.contains("document") || mime.contains("rtf") || mime.equals("text/plain")) {
            return DOCUMENT;
        }

        if (mime.contains("zip") || mime.contains("compressed") || mime.contains("tar") || mime.contains("7z") || mime.contains("rar") || mime.contains("gz")) {
            return ARCHIVE;
        }

        return switch (ext) {
            case "jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "heic", "tiff" -> IMAGE;
            case "mp4", "mov", "avi", "mkv", "webm", "flv", "wmv" -> VIDEO;
            case "mp3", "wav", "flac", "aac", "ogg", "m4a" -> AUDIO;
            case "xls", "xlsx", "csv", "ods", "tsv" -> SPREADSHEET;
            case "ppt", "pptx", "odp", "ppsx" -> PRESENTATION;
            case "doc", "docx", "txt", "rtf", "odt", "md", "log", "pdf" -> DOCUMENT;
            case "zip", "rar", "7z", "tar", "gz", "iso" -> ARCHIVE;
            default -> UNKNOWN;
        };
    }

    private static String getExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex > 0 && dotIndex < filename.length() - 1) 
                ? filename.substring(dotIndex + 1) 
                : "";
    }
}