package home.fileserver.models;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
    @Index(name = "idx_blob_hash", columnList = "sha256_hash", unique = true),
    @Index(name = "idx_blob_hash_size", columnList = "sha256_hash, size_in_bytes", unique = true),
    @Index(name = "idx_file_blobs_located_on", columnList = "located_on")
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

    @Column(name = "sha256_hash", nullable = false, length = 64, unique = true)
    private String sha256Hash;

    @Column(name = "storage_path", nullable = false, length = 500)
    private String storagePath;

    @Column(name = "size_in_bytes", nullable = false)
    private long sizeInBytes;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Column(name = "ref_count", nullable = false)
    @Builder.Default
    private long refCount = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "located_on", nullable = false, length = 50)
    @Builder.Default
    private StorageLocation locatedOn = StorageLocation.LOCAL;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private Instant createdAt;
}