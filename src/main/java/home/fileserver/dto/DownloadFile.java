package home.fileserver.dto;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

public record DownloadFile(String originalFilename, MediaType type, Resource resourcePath) {}
