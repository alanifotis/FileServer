package home.fileserver.models;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "app_users")
@Getter
@Setter
@Builder

public class AppUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    // The random 32-byte salt generated at registration.
    // This is public knowledge (stored in DB), but needed to derive the private
    // key.
    @Column(nullable = false)
    private byte[] prfSalt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<SimpleGrantedAuthority> authenticators = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public @Nullable String getPassword() {
        return null; // No password! This is a passwordless system.
    }

    // Getters, Setters, Constructors (omitted for brevity)
    public void addAuthenticator(Authenticator auth) {
        authenticators.add(auth);
        auth.setUser(this);
    }

    @Override
    public @NonNull String getUsername() {
        return this.email;
    }

    public AppUser() {
        this.authenticators = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        this.email = null;
        this.prfSalt = null;
        this.id = null;
    }
}