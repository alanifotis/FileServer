package home.fileserver.models;

import java.time.Instant;
import org.springframework.data.domain.Persistable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
    @Index(name = "idx_user_category", columnList = "user_id, category, is_trashed")
})
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor @Builder
public class FileMetadata implements Persistable<Long>{

    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blob_id")
    private FileBlob blob;

    // --- File Info ---
    @Column(name = "original_filename", nullable = false)
    private String originalFilename; 

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", length = 30, nullable = false)
    private FileCategory category;

    // --- Hierarchy ---
    @Column(name = "parent_id")
    private Long parentId; 

    @Column(name = "is_folder", nullable = false)
    private boolean isFolder;

    // --- Lifecycle ---
    @Column(name = "is_trashed", nullable = false)
    @Builder.Default
    private boolean isTrashed = false;

    @Column(name = "is_public", nullable = false) 
    @Builder.Default
    private boolean isPublic = false;

    @Column(name = "uploaded_at", nullable = false, updatable = false, insertable = false)
    private Instant uploadedAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

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