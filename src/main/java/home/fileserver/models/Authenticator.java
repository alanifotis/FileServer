package home.fileserver.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "authenticators")
@Getter
@Setter
public class Authenticator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String label; // e.g. "MacBook Pro"

    @Column(nullable = false, unique = true)
    private String credentialId; // Base64URL encoded ID

    @Lob
    @Column(nullable = false)
    private byte[] publicKey; // The COSE Key

    @Column(nullable = false)
    private long count; // Counter to prevent cloning attacks

    @Column(nullable = false)
    private String aaguid; // Authenticator Attestation GUID

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;
}