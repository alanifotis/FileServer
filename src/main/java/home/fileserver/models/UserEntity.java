package home.fileserver.models;

import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Id;

public record UserEntity(
    @Id
    UUID id,
    UserDetails user
) {
    public String getPassword() {
        return user.getPassword();
    }
}