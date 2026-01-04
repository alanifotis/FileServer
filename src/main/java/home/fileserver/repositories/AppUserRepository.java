package home.fileserver.repositories;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import home.fileserver.models.User;

@Repository
public interface AppUserRepository extends JpaRepository<User, Long> {

    @Nullable User findByEmail(@NonNull String email);

    boolean existsByEmail(@NonNull String email);

}
