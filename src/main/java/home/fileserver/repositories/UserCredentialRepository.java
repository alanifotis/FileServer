package home.fileserver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import home.fileserver.models.UserCredential;

import java.util.List;
import java.util.Optional;

public interface UserCredentialRepository extends JpaRepository<UserCredential, String> {
    // Used to show the "My Passkeys" list in settings
    List<UserCredential> findByUserId(Long userId);
    Optional<UserCredential> findByCredentialId(String credentialId);
}