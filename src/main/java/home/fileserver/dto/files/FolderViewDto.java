package home.fileserver.dto.files;

import java.util.List;

public record FolderViewDto (List<BreadcrumbDto> path, List<FolderDto> content) {}