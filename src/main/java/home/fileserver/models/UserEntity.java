package home.fileserver.models;

import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public record UserEntity(
    @Id
    UUID id,
    UserDetails user,
    String email
) {
    public String getPassword() {
        return user.getPassword();
    }
}