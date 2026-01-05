package home.fileserver.models;

import jakarta.persistence.*;
import lombok.*;

import org.springframework.data.domain.Persistable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.webauthn.api.Bytes;

import java.time.Instant;
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

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "roles", nullable = false, length = 50)
    @Builder.Default
    private String role = "USER";
  
    @Column(name = "avatar_file_id")
    @Builder.Default
    private Long avatarId = null; 

    @Column(length = 10)
    @Builder.Default
    private String locale = "en-US";

    // --- File Server Specifics ---

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_tier", length = 50, nullable = false)
    @Builder.Default
    private PlanTier planTier = PlanTier.FREE;

    @Column(name = "storage_used_bytes", nullable = false)
    @Builder.Default
    private long storageUsedBytes = 0;

    // --- Security ---

    @Column(name = "security_stamp", nullable = false)
    @Builder.Default
    private Instant securityStamp = Instant.now();

    @Column(name = "registred_at", nullable = false, updatable = false, insertable = false)
    private Instant registredAt;

    @Transient
    @Builder.Default
    private boolean isNew = true;

    @Override
    public boolean isNew() {
        return isNew;
    }
    
    @PrePersist
    @PostLoad
    void markNotNew() {
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
        return this.id == null ? null : Longs.toBytes(this.id);
    }
}