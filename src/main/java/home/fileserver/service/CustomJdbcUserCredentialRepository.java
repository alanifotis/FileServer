package home.fileserver.service;

import home.fileserver.utilities.Longs;
import jakarta.transaction.Transactional;
import org.jspecify.annotations.Nullable;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.web.webauthn.api.*;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import org.springframework.util.StringUtils;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


public class CustomJdbcUserCredentialRepository implements UserCredentialRepository {
    private final JdbcTemplate jdbcTemplate;

    public CustomJdbcUserCredentialRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public void save(CredentialRecord record) {
        // 1. CRITICAL: Convert WebAuthn ID (Bytes) -> Snowflake (Long)
        // Spring's default impl would send a String here and break your DB.
        long userId = Longs.fromByteArray(record.getUserEntityUserId().getBytes());

        // 2. Flatten transports to simple CSV string
        String transports = null;
        record.getTransports();
        transports = record.getTransports().stream()
                .map(AuthenticatorTransport::getValue)
                .collect(Collectors.joining(","));

        // 3. Postgres "Upsert" (Cleaner than Spring's check-then-insert)
        String sql = """
            INSERT INTO user_credentials (
                credential_id, user_id, public_key, label, signature_count,\s
                uv_initialized, backup_eligible, backup_state, authenticator_transports,\s
                attestation_object, attestation_client_data_json, created, last_used
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (credential_id) DO UPDATE SET
                signature_count = EXCLUDED.signature_count,
                last_used = EXCLUDED.last_used,
                uv_initialized = EXCLUDED.uv_initialized,
                backup_state = EXCLUDED.backup_state,
                authenticator_transports = EXCLUDED.authenticator_transports
       \s""";

        // 4. No complex SqlParameterValue wrappers needed for Postgres Bytea
        record.getLastUsed();
        jdbcTemplate.update(sql,
                record.getCredentialId().toBase64UrlString(), // ID is string in DB
                userId,                                       // ID is Long in DB
                record.getPublicKey().getBytes(),
                record.getLabel(),
                record.getSignatureCount(),
                record.isUvInitialized(),
                record.isBackupEligible(),
                record.isBackupState(),
                transports,
                record.getAttestationObject() != null ? record.getAttestationObject().getBytes() : null,
                record.getAttestationClientDataJSON() != null ? record.getAttestationClientDataJSON().getBytes() : null,
                Timestamp.from(record.getCreated()),
                Timestamp.from(record.getLastUsed())
        );
    }

    @Override
    public @Nullable CredentialRecord findByCredentialId(Bytes credentialId) {
        String sql = "SELECT * FROM user_credentials WHERE credential_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new CredentialRecordMapper(), credentialId.toBase64UrlString());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<CredentialRecord> findByUserId(Bytes userId) {
        // 1. CRITICAL: Convert lookup ID (Bytes) -> Snowflake (Long)
        long snowflakeId = Longs.fromByteArray(userId.getBytes());
        
        String sql = "SELECT * FROM user_credentials WHERE user_id = ?";
        return jdbcTemplate.query(sql, new CredentialRecordMapper(), snowflakeId);
    }

    @Override
    @Transactional
    public void delete(Bytes credentialId) {
        String sql = "DELETE FROM user_credentials WHERE credential_id = ?";
        jdbcTemplate.update(sql, credentialId.toBase64UrlString());
    }

    /**
     * Maps the SQL result back to Spring's object.
     * Handles the Long -> Bytes conversion for you.
     */
    private static class CredentialRecordMapper implements RowMapper<CredentialRecord> {
        @Override
        public CredentialRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
            
            // A. Recover the User ID: BigInt -> byte[] -> Bytes
            long userIdLong = rs.getLong("user_id");
            Bytes userEntityUserId = new Bytes(Longs.toByteArray(userIdLong));

            // B. Recover Transports
            Set<AuthenticatorTransport> transports = new HashSet<>();
            String transportsStr = rs.getString("authenticator_transports");
            if (StringUtils.hasText(transportsStr)) {
                for (String t : StringUtils.commaDelimitedListToStringArray(transportsStr)) {
                    try {
                        transports.add(AuthenticatorTransport.valueOf(t));
                    } catch (IllegalArgumentException ignored) {
                        // Ignore unknown transports (forward compatibility)
                    }
                }
            }

            // C. Build Record
            // Note: Postgres driver handles getBytes("column") for 'bytea' perfectly.
            return ImmutableCredentialRecord.builder()
                    .credentialType(PublicKeyCredentialType.PUBLIC_KEY)
                    .credentialId(Bytes.fromBase64(rs.getString("credential_id"))) // Assuming stored as Base64URL string
                    .userEntityUserId(userEntityUserId)
                    .publicKey(new ImmutablePublicKeyCose(rs.getBytes("public_key")))
                    .label(rs.getString("label"))
                    .signatureCount(rs.getLong("signature_count"))
                    .uvInitialized(rs.getBoolean("uv_initialized"))
                    .backupEligible(rs.getBoolean("backup_eligible"))
                    .backupState(rs.getBoolean("backup_state"))
                    .transports(transports)
                    .attestationObject(rs.getBytes("attestation_object") != null ? new Bytes(rs.getBytes("attestation_object")) : null)
                    .attestationClientDataJSON(rs.getBytes("attestation_client_data_json") != null ? new Bytes(rs.getBytes("attestation_client_data_json")) : null)
                    .created(rs.getTimestamp("created").toInstant())
                    .lastUsed(rs.getTimestamp("last_used") != null ? rs.getTimestamp("last_used").toInstant() : null)
                    .build();
        }
    }
}