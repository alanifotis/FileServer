package home.fileserver.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import home.fileserver.utilities.SnowflakeId;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter 
@Setter 
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id 
    @SnowflakeId
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Builder.Default
    @Column(columnDefinition = "varchar(50) default 'USER'")
    private String roles = "USER";

    // --- UX Fields ---
    
    @Column(name = "display_name")
    private String displayName;

    @Column(name = "avatar_url")
    private String avatarUrl; // Null = use frontend generation

    @Builder.Default
    @Column(length = 10)
    private String locale = "en-US";

    // --- File Server Specifics ---

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_tier", length = 50)
    private PlanTier planTier;

    @Builder.Default
    @Column(name = "storage_used_bytes")
    private long storageUsedBytes = 0; // The counter
    
    @Column(name = "root_folder_id")
    private Long rootFolderId; // Optimization to find their Home quickly

    // --- Security ---

    @Column(name = "security_stamp", nullable = false)
    private Long securityStamp; // Changed to invalidate JWTs

    // --- UserDetails Boilerplate ---

    @Override
    public String getUsername() { return email; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + roles));
    }

    @Override public String getPassword() { return ""; } // No password
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; } // Always true
}

// The Enum for your tiers
enum PlanTier {
    FREE, PRO, ENTERPRISE
}