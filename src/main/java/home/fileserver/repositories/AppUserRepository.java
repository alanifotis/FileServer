package home.fileserver.repositories;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import home.fileserver.models.User;

public interface AppUserRepository extends JpaRepository<User, Long> {

    @Nullable User findByEmail(@NonNull String email);

    @Modifying
    @Transactional
    @Query(value = """
                INSERT INTO "users" (  -- Added quotes for safety against reserved keywords
                    id,
                    email,
                    roles,
                    display_name,
                    avatar_url,
                    locale,
                    plan_tier,
                    storage_used_bytes,
                    root_folder_id,
                    security_stamp
                ) VALUES (
                    :#{#user.id},
                    :#{#user.email},
                    :#{#user.role},
                    :#{#user.displayName},
                    :#{#user.avatarUrl},
                    :#{#user.locale},
                    :#{#user.planTier.name()},
                    :#{#user.storageUsedBytes},
                    :#{#user.rootFolderId},
                    :#{#user.securityStamp}
                )
            """, nativeQuery = true)
    void insertUser(@Param("user") User user);
}
