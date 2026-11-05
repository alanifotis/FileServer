package home.fileserver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import home.fileserver.models.CustomUserCredential;

import java.util.List;
import java.util.Optional;

public interface CustomUserCredentialRepository extends JpaRepository<CustomUserCredential, String> {
    // Used to show the "My Passkeys" list in settings
    List<CustomUserCredential> findByUserId(Long userId);
    Optional<CustomUserCredential> findByCredentialId(String credentialId);
}