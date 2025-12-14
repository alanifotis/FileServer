package home.fileserver.models;

import jakarta.persistence.*;
import lombok.Setter;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "app_users")
public class AppUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    // The random 32-byte salt generated at registration.
    // This is public knowledge (stored in DB), but needed to derive the private
    // key.
    @Setter
    @Column(nullable = false)
    private byte[] prfSalt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public @Nullable String getPassword() {
        return null;
    } // No password! This is a passwordless system.

    // Getters, Setters, Constructors (omitted for brevity)
    public void addAuthenticator(Authenticator auth) {
        auth.setUser(AppUser.this);
    }

    @Override
    public String getUsername() {
        return this.email;
    }

}