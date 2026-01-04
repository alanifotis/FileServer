package home.fileserver.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_credentials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomUserCredential {
    @Id
    @Column(name = "credential_id", length = 300, nullable = false)
    private String credentialId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder.Default
    @Column(nullable = false)
    private String label = "Registration Passkey";

    @Column(name = "public_key", nullable = false)
    private byte[] publicKey;

    @Column(name = "authenticator_transports")
    private String authenticatorTransports;

    @Column(name = "prf_salt", length = 64, nullable = false)
    private String prfSalt;

    @Column(name = "prf_wrapped_key", nullable = false)
    private String prfWrappedKey;

    @Column(name = "prf_iv", length = 24, nullable = false)
    private String prfIv;

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

    @Column(name = "attestation_object")
    private byte[] attestationObject;

    @Column(name = "attestation_client_data_json")
    private byte[] attestationClientDataJson;

    @Column(name = "created", nullable = false, updatable = false, insertable = false)
    private Instant created;

    @Column(name = "last_used")
    private Instant lastUsed;
}