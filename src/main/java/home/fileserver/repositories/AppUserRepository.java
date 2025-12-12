package home.fileserver.repositories;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;

import home.fileserver.models.AppUser;

public interface AppUserRepository extends JpaRepository<AppUser, Long>{

    @Nullable AppUser findByEmail(@NonNull String email);
    
}
