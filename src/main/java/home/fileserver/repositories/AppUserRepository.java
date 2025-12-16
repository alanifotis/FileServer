package home.fileserver.repositories;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;

import home.fileserver.models.User;

public interface AppUserRepository extends JpaRepository<User, Long>{

    @Nullable User findByEmail(@NonNull String email);
    
}
