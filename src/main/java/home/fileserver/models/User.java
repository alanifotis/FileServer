package home.fileserver.models;

import jakarta.persistence.*;
import lombok.*;

import org.springframework.data.domain.Persistable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.webauthn.api.Bytes;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import home.fileserver.utilities.Longs;

@Entity
@Table(name = "users")
@Getter 
@Setter 
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User implements UserDetails, Persistable<Long> {

    @Id 
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Builder.Default
    @Column(name = "roles", nullable = false, length = 50)
    private String role = "USER";

    // --- UX Fields ---
    
    @Column(name = "display_name")
    private String displayName;

    @Column(name = "avatar_file_id")
    private Long avatarId; 

    @Builder.Default
    @Column(length = 10)
    private String locale = "en-US";

    // --- File Server Specifics ---

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "plan_tier", length = 50, nullable = false)
    private PlanTier planTier = PlanTier.FREE;

    @Builder.Default
    @Column(name = "storage_used_bytes", nullable = false)
    private long storageUsedBytes = 0; 
    
    @Column(name = "root_folder_id", nullable = false)
    private Long rootFolderId; 

    // --- Security ---

    @Column(name = "security_stamp", nullable = false)
    private Long securityStamp;

    @Column(name = "registred_at", nullable = false, updatable = false, insertable = false)
    private LocalDateTime registredAt;

    @Transient
    @Builder.Default
    private boolean isNew = true;

    @Override
    public boolean isNew() {
        return isNew;
    }

    @PrePersist
    protected void onCreate() {
        
        if (this.securityStamp == null) {
            this.securityStamp = System.currentTimeMillis();
        }
        this.isNew = false;
    }

    @PostLoad
    void onLoad() {
        this.isNew = false;
    }

    // --- UserDetails Boilerplate ---

    @Override public String getUsername() { return email; }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override public String getPassword() { return ""; } 
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    public Bytes getByteId() {
        return this.id == null ? null : new Bytes(Longs.toByteArray(this.id));
    }
}