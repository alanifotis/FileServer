package home.fileserver.dto;

import home.fileserver.models.User;

public record UserDto(
        String email,
        String displayName,
        String avatarUri,
        String planTier,
        long storageUsedBytes,
        long rootFolderId) 
        {
                public static UserDto fromUser(User user) {
                        return new UserDto(user.getEmail(), 
                        user.getDisplayName(), 
                        "avatarUri()", 
                        user.getPlanTier().toString(),
                        user.getStorageUsedBytes(), 
                        user.getId());
                }


        }
