package home.fileserver.models;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "file_blobs", indexes = {
    @Index(name = "idx_blob_hash", columnList = "sha256_hash", unique = true)
})
@Getter 
@Setter
@AllArgsConstructor 
@NoArgsConstructor 
@Builder
public class FileBlob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The SHA-256 Hash (Hex string is always 64 chars)
    @Column(name = "sha256_hash", nullable = false, length = 100, unique = true)
    private String sha256Hash;

    @Column(name = "storage_path", nullable = false, length = 500)
    private String storagePath;

    @Column(name = "size_in_bytes", nullable = false)
    private long sizeInBytes;

    @Column(name = "content_type", length = 100)
    private String contentType;

    // Reference Counter
    @Column(name = "ref_count", nullable = false)
    @Builder.Default
    private long refCount = 1;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private Instant createdAt;
}
