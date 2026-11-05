package home.fileserver.service;

import home.fileserver.dto.RegistrationRequest.PrfContext;
import home.fileserver.models.User;
import home.fileserver.models.CustomUserCredential;
import home.fileserver.repositories.AppUserRepository;
import home.fileserver.utilities.Longs;
import jakarta.transaction.Transactional;
import org.springframework.security.web.webauthn.api.*;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * Adapts the standard Spring Security WebAuthn management to your JPA Entities.
 * Includes support for Zero Knowledge (PRF) persistence.
 */
@Component
@Transactional
public class CustomJdbcUserCredentialRepository implements UserCredentialRepository {
    public static final ScopedValue<PrfContext> PRF_SCOPE = ScopedValue.newInstance();

    private final home.fileserver.repositories.CustomUserCredentialRepository jpaCredentialRepo;
    private final AppUserRepository userRepo;

    public CustomJdbcUserCredentialRepository(home.fileserver.repositories.CustomUserCredentialRepository jpaCredentialRepo,
            AppUserRepository userRepo) {
        this.jpaCredentialRepo = jpaCredentialRepo;
        this.userRepo = userRepo;
    }

    // =================================================================================
    // 1. STANDARD SPRING SECURITY METHODS (Used for Login/Auth)
    // =================================================================================

    @Override
    public void save(CredentialRecord record) {
        // This method is called by Spring Security to update counters (signature count)
        // after a successful login. It DOES NOT handle PRF fields.

        // We find the existing entity and update it.
        jpaCredentialRepo.findById(record.getCredentialId().toBase64UrlString())
                .ifPresentOrElse(entity -> {
                    entity.setSignatureCount(record.getSignatureCount());
                    entity.setLastUsed(record.getLastUsed() != null
                            ? record.getLastUsed()
                            : Instant.now());
                    entity.setUvInitialized(record.isUvInitialized());
                    entity.setBackupState(record.isBackupState());
                    // We do NOT overwrite PRF fields here because 'record' doesn't have them.
                    jpaCredentialRepo.save(entity);
                }, () -> {
                    // ✅ Read the Scope
                    // .isBound() checks if we are inside a ScopedValue.where() block
                    if (PRF_SCOPE.isBound()) {
                        PrfContext ctx = PRF_SCOPE.get();
                        // Pass the hidden data to your internal save logic
                        doInternalSave(record, ctx.salt(), ctx.wrappedKey(), ctx.iv());
                    } else {
                        // Fallback: Standard save without PRF data
                        throw new IllegalStateException("PRF Security Context is missing. Cannot save credential.");
                    }
                });
    }

    @Override
    public void delete(Bytes credentialId) {
        jpaCredentialRepo.deleteById(credentialId.toBase64UrlString());
    }

    @Override
    public CredentialRecord findByCredentialId(Bytes credentialId) {
        return jpaCredentialRepo.findById(credentialId.toBase64UrlString())
                .map(this::mapEntityToRecord)
                .orElse(null);
    }

    @Override
    public List<CredentialRecord> findByUserId(Bytes userId) {
        // CRITICAL: Convert WebAuthn Bytes -> Snowflake Long
        long snowflakeId = Longs.fromBytes(userId);

        return jpaCredentialRepo.findByUserId(snowflakeId).stream()
                .map(this::mapEntityToRecord)
                .toList();
    }

    // =================================================================================
    // 2. CUSTOM ZERO KNOWLEDGE METHOD (Used for Registration)
    // =================================================================================

    /**
     * Custom save method that handles PRF (Zero Knowledge) data.
     * Call this from your RegistrationController instead of the standard save().
     */
    public void saveWithPrf(CredentialRecord record, String prfSalt, String prfWrappedKey, String prfIv) {
        doInternalSave(record, prfSalt, prfWrappedKey, prfIv);
    }

    private void doInternalSave(CredentialRecord record, String salt, String wrappedKey, String iv) {
        // 1. Resolve User
        long userId = Longs.fromBytes(record.getUserEntityUserId());
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found for ID: " + userId));

        // 2. Flatten Transports
        String transports = null;
        if (record.getTransports() != null) {
            transports = record.getTransports()
            .stream()
            .map(t -> Objects.requireNonNull(t).getValue())
            .collect(Collectors.joining(","));
        }

        // 3. Create or Update Entity
        CustomUserCredential entity = CustomUserCredential.builder()
                .credentialId(record.getCredentialId().toBase64UrlString())
                .user(user)
                .label(record.getLabel())
                .publicKey(record.getPublicKey().getBytes())
                .signatureCount(record.getSignatureCount())
                .uvInitialized(record.isUvInitialized())
                .backupEligible(record.isBackupEligible())
                .backupState(record.isBackupState())
                .authenticatorTransports(transports)

                // PRF Fields (Zero Knowledge)
                .prfSalt(salt)
                .prfWrappedKey(wrappedKey)
                .prfIv(iv)

                // Attestation
                .attestationObject(
                        record.getAttestationObject() != null ? record.getAttestationObject().getBytes() : null)
                .attestationClientDataJson(
                        record.getAttestationClientDataJSON() != null ? record.getAttestationClientDataJSON().getBytes()
                                : null)

                // Dates
                .created(record.getCreated())
                .lastUsed(record.getLastUsed() != null
                        ? record.getLastUsed()
                        : Instant.now())
                .build();

        jpaCredentialRepo.save(entity);
    }

    // =================================================================================
    // 3. MAPPER (Entity -> Spring Security Record)
    // =================================================================================

    private CredentialRecord mapEntityToRecord(CustomUserCredential entity) {
        // Convert Long ID -> Bytes
        Bytes userIdBytes = Longs.toBytes(entity.getUser().getId());

        // Parse Transports
        Set<AuthenticatorTransport> transports = new HashSet<>();
        if (StringUtils.hasText(entity.getAuthenticatorTransports())) {
            for (String t : StringUtils.commaDelimitedListToStringArray(entity.getAuthenticatorTransports())) {
                try {
                    transports.add(AuthenticatorTransport.valueOf(t));
                } catch (IllegalArgumentException ignored) {
                    // Ignore unknown transports for forward compatibility
                }
            }
        }

        return ImmutableCredentialRecord.builder()
                .credentialId(Bytes.fromBase64(entity.getCredentialId()))
                .userEntityUserId(userIdBytes)
                .publicKey(new ImmutablePublicKeyCose(entity.getPublicKey()))
                .signatureCount(entity.getSignatureCount())
                .uvInitialized(entity.isUvInitialized())
                .backupEligible(entity.isBackupEligible())
                .backupState(entity.isBackupState())
                .transports(transports)
                .label(entity.getLabel())
                // Attestation
                .attestationObject(
                        entity.getAttestationObject() != null ? new Bytes(entity.getAttestationObject()) : null)
                .attestationClientDataJSON(
                        entity.getAttestationClientDataJson() != null ? new Bytes(entity.getAttestationClientDataJson())
                                : null)
                // Dates
                .created(entity.getCreated())
                .lastUsed(entity.getLastUsed() != null ? entity.getLastUsed() : Instant.now())
                // Note: PRF fields are NOT part of the standard CredentialRecord interface,
                // so we don't map them here. They are used separately during encryption.
                .build();
    }
}