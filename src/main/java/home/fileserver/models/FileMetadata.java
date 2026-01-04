package home.fileserver.models;

import java.time.LocalDateTime;

import org.springframework.data.domain.Persistable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "file_metadata", indexes = {
    @Index(name = "idx_folder_content", columnList = "parent_id, is_trashed"),
    @Index(name = "idx_owner_stats", columnList = "owner_id, is_trashed, size_in_bytes")
})
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor @Builder
public class FileMetadata implements Persistable<Long>{

    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // --- File Info ---
    @Column(name = "original_filename", nullable = false)
    private String originalFilename; 

    @Column(name = "stored_filename")
    private String storedName; 

    @Column(length = 50)
    private String extension;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Column(name = "size_in_bytes")
    private long sizeInBytes;

    // --- Hierarchy ---
    @Column(name = "parent_id")
    private Long parentId; 

    @Column(name = "is_folder", nullable = false)
    private boolean isFolder;

    // --- Integrity ---
    @Column(name = "file_hash", length = 100)
    private String fileHash; 

    // --- Lifecycle ---
    @Column(name = "is_trashed", nullable = false)
    @Builder.Default
    private boolean isTrashed = false;

    @Column(name = "is_public", nullable = false) 
    @Builder.Default
    private boolean isPublic = false;

    @Column(name = "uploaded_at", nullable = false, updatable = false, insertable = false)
    private LocalDateTime uploadedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

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
}