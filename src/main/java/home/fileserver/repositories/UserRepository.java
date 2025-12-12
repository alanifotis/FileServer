package home.fileserver.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import home.fileserver.models.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, UUID>  {
    
}
