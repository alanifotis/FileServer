package home.fileserver.repositories;

import java.util.UUID;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;

import home.fileserver.models.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, UUID>  {
    @Nullable UserEntity findByEmail(@NonNull String email);
}
