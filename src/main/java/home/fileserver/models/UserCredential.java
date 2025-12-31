package home.fileserver.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_credentials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCredential {

    /**
     * Unique Credential ID (Base64URL string).
     * We don't use @GeneratedValue because this ID comes from the client/authenticator.
     */
    @Id
    @Column(name = "credential_id", length = 300, nullable = false)
    private String credentialId;

    /**
     * Strict link to the User.
     * FetchType.LAZY ensures we don't load the User object unless we ask for it.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // --- Passkey Metadata ---

    @Builder.Default
    @Column(nullable = false)
    private String label = "Registration Passkey";

    /**
     * Raw public key (COSE Key format).
     * Maps to BYTEA in Postgres.
     */
    @Column(name = "public_key", nullable = false)
    private byte[] publicKey;

    /**
     * Stored as CSV string: "usb,nfc,internal"
     */
    @Column(name = "authenticator_transports")
    private String authenticatorTransports;

    // --- ZERO KNOWLEDGE ENCRYPTION (PRF) ---
    // Strict Mode: These fields are mandatory (nullable = false).

    @Column(name = "prf_salt", length = 64, nullable = false)
    private String prfSalt;

    @Column(name = "prf_wrapped_key", nullable = false)
    private String prfWrappedKey;

    @Column(name = "prf_iv", length = 24, nullable = false)
    private String prfIv;

    // --- Security Counters & Flags ---

    @Builder.Default
    @Column(name = "signature_count")
    private Long signatureCount = 0L;

    @Builder.Default
    @Column(name = "uv_initialized")
    private boolean uvInitialized = false;

    @Builder.Default
    @Column(name = "backup_eligible")
    private boolean backupEligible = false;

    @Builder.Default
    @Column(name = "backup_state")
    private boolean backupState = false;

    // --- Attestation (Audit) ---

    @Column(name = "attestation_object")
    private byte[] attestationObject;

    @Column(name = "attestation_client_data_json")
    private byte[] attestationClientDataJson;

    // --- Audit Timestamps ---

    @CreationTimestamp
    @Column(name = "created", nullable = false, updatable = false)
    private LocalDateTime created;

    /**
     * Manually updated during login success
     */
    @Column(name = "last_used")
    private LocalDateTime lastUsed;
}