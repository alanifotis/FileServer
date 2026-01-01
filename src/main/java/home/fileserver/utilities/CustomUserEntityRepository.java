package home.fileserver.utilities;

import org.jspecify.annotations.NonNull;


// Use your package

import org.springframework.security.web.webauthn.api.Bytes;
import org.springframework.security.web.webauthn.api.ImmutablePublicKeyCredentialUserEntity;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialUserEntity;
import org.springframework.security.web.webauthn.management.PublicKeyCredentialUserEntityRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import home.fileserver.models.User;
import home.fileserver.repositories.AppUserRepository;

import java.nio.ByteBuffer;

/**
 * ADAPTER: Bridges Spring Security WebAuthn with your Snowflake ID User Entity.
 */
@Repository
@Transactional(readOnly = true)
public class CustomUserEntityRepository implements PublicKeyCredentialUserEntityRepository {

    private final AppUserRepository userRepository;

    public CustomUserEntityRepository(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Finds a user by their WebAuthn Handle (User ID).
     * Converts the raw bytes back into your Snowflake Long ID.
     */
    @Override
    public PublicKeyCredentialUserEntity findById(Bytes id) {
        if (id == null) return null;

        try {
            // 1. Convert WebAuthn Bytes -> Long Snowflake
            long snowflakeId = ByteBuffer.wrap(id.getBytes()).getLong();

            // 2. Delegate to your existing Repository
            return userRepository.findById(snowflakeId)
                    .map(this::mapToWebAuthnUser)
                    .orElse(null);
        } catch (Exception e) {
            // If bytes aren't a valid long, the ID is invalid/tampered
            return null;
        }
    }

    // Spring Security 7+ alias support
    public PublicKeyCredentialUserEntity findByUsername(String username) {
        if (username == null) return null;

        User user = userRepository.findByEmail(username);
        return (user != null) ? mapToWebAuthnUser(user) : null;
    }

    /**
     * Updates an existing user's display name during a WebAuthn flow.
     * * NOTE: We DO NOT create new users here. Your 'User' entity requires 
     * specific fields (rootFolderId, planTier) that WebAuthn doesn't provide.
     * Registration must be handled by your RegisterController.
     */
    @Override
    @Transactional
    public void save(PublicKeyCredentialUserEntity userEntity) {
        if (userEntity == null) return;

        // We only support UPDATES here. 
        User existingUser = userRepository.findByEmail(userEntity.getName());

        if (existingUser != null) {
            // Only update if the display name actually changed
            if (userEntity.getDisplayName() != null && 
                !userEntity.getDisplayName().equals(existingUser.getDisplayName())) {
                
                existingUser.setDisplayName(userEntity.getDisplayName());
                userRepository.save(existingUser);
            }
        }
        // If user is null, we do nothing. 
        // We cannot create a User here because we lack the Snowflake ID and Root Folder ID.
    }

    /**
     * Deletes the user by ID.
     */
    @Override
    @Transactional
    public void delete(Bytes id) {
        if (id == null) return;
        try {
            long snowflakeId = ByteBuffer.wrap(id.getBytes()).getLong();
            userRepository.deleteById(snowflakeId);
        } catch (Exception ignored) {
            // ID format was invalid, nothing to delete
        }
    }

    // --- Helper Methods ---

    /**
     * Converts your JPA User entity into the object Spring WebAuthn expects.
     */
    private PublicKeyCredentialUserEntity mapToWebAuthnUser(@NonNull User user) {
        // Convert Long Snowflake -> 8 Bytes
        Bytes webAuthnId = new Bytes(Longs.toByteArray(user.getId()));

        return ImmutablePublicKeyCredentialUserEntity.builder()
                .id(webAuthnId)
                .name(user.getEmail())
                .displayName(user.getDisplayName())
                .build();
    }
}