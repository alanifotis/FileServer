package home.fileserver.models;

import jakarta.persistence.*;
import lombok.*;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.webauthn.api.Bytes;

import home.fileserver.utilities.Longs;
import home.fileserver.utilities.SnowflakeId;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter 
@Setter 
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User implements UserDetails {

    @Id 
    @SnowflakeId // Assuming this is your custom ID generator annotation
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Builder.Default
    @Column(name = "roles", nullable = false, length = 50)
    private String role = "USER";

    // --- UX Fields ---
    
    @Column(name = "display_name")
    private String displayName;

    @Column(name = "avatar_url")
    private String avatarUrl; 

    @Builder.Default
    @Column(length = 10)
    private String locale = "en-US";

    // --- File Server Specifics ---

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "plan_tier", length = 50, nullable = false)
    private PlanTier planTier = PlanTier.FREE; // Ensure Enum has a default

    @Builder.Default
    @Column(name = "storage_used_bytes", nullable = false)
    private long storageUsedBytes = 0; 
    
    // The "Home" folder. In strict mode, this CANNOT be null.
    // We set it equal to 'id' automatically below.
    @Column(name = "root_folder_id", nullable = false)
    private Long rootFolderId; 

    // --- Security ---

    // Initialized to current time so it is never null on creation
    @Builder.Default
    @Column(name = "security_stamp", nullable = false)
    private Long securityStamp = System.currentTimeMillis(); 

    // --- Lifecycle Hooks ---

    /**
     * Solves the SQL limitation: "DEFAULT id" is not possible in SQL.
     * This runs automatically before the INSERT statement.
     */
    @PrePersist
    public void prePersist() {
        // 1. Ensure Security Stamp is present
        if (this.securityStamp == null) {
            this.securityStamp = System.currentTimeMillis();
        }
        
        // 2. Default Root Folder ID to the User ID (if not explicitly set)
        // NOTE: This assumes 'id' is generated BEFORE this runs. 
        // Snowflake IDs usually are generated on instantiation or by the Service layer.
        if (this.rootFolderId == null && this.id != null) {
            this.rootFolderId = this.id;
        }
    }

    // --- UserDetails Boilerplate ---

    @Override
    public String getUsername() { return email; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Maps "USER" -> "ROLE_USER" for Spring Security
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override public String getPassword() { return ""; } // No password (Passkey only)
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    public Bytes getByteId() {
        return new Bytes(Longs.toByteArray(this.getId()));
    }

}