package home.fileserver.dto;

public record UserDto(
        String email,
        String displayName,
        String avatarIcon,
        String planTier,
        long storageUsedBytes,
        long rootFolderId) 
        {
                
        }
