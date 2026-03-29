package home.fileserver.repositories;

import home.fileserver.dto.PendingFileTransfer;
import home.fileserver.models.StorageLocation;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FileBlobSyncRepository {

    private static final String PENDING_TRANSFERS_SQL = """
        SELECT 
            b.id, 
            b.storage_path, 
            b.sha256_hash,
            (SELECT m.user_id 
             FROM file_metadata m 
             WHERE m.blob_id = b.id 
             ORDER BY m.uploaded_at ASC 
             LIMIT 1) as original_user_id
        FROM file_blobs b
        WHERE b.located_on = 'LOCAL'
        LIMIT 100
        """;

    private static final String MARK_TRANSFERRED_SQL = """
        UPDATE file_blobs 
        SET located_on = :location 
        WHERE id = :id
        """;

    private final JdbcClient jdbcClient;

    public FileBlobSyncRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<PendingFileTransfer> getPendingTransfers() {
        return jdbcClient.sql(PENDING_TRANSFERS_SQL)
                .query(PendingFileTransfer.class)
                .list();
    }

    public int markAsTransferred(Long blobId, StorageLocation newLocation) {
        return jdbcClient.sql(MARK_TRANSFERRED_SQL)
                .param("location", newLocation.name()) 
                .param("id", blobId)
                .update();
    }
}