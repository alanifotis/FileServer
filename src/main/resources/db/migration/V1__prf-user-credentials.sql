/* * 1. USERS TABLE 
 * Strict Mode: No Recovery Keys stored here. 
 * If a user loses their PRF devices, the account is unrecoverable (True Zero Knowledge).
 */
 
CREATE TABLE users (
    id BIGINT NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255),
    avatar_file_id BIGINT, 
    locale VARCHAR(10) DEFAULT 'en-US',
    roles VARCHAR(50) DEFAULT 'USER' NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'FREE' NOT NULL, 
    storage_used_bytes BIGINT DEFAULT 0 NOT NULL,
    security_stamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    registred_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

/* * 2. WEB_AUTHN CREDENTIALS TABLE
 * Stores device-specific encryption locks (PRF).
 */
CREATE TABLE user_credentials (
    -- The unique Credential ID (Base64URL from authenticator)
    credential_id VARCHAR(300) NOT NULL PRIMARY KEY,

    -- LINK TO USERS TABLE
    user_id BIGINT NOT NULL,

    -- Passkey Metadata
    label VARCHAR(255) DEFAULT 'Registration Passkey' NOT NULL,
    public_key BYTEA NOT NULL,             
    authenticator_transports VARCHAR(255), 

    -- ZERO KNOWLEDGE ENCRYPTION (PRF)
    -- Required: We block registration if these are null.
    prf_salt VARCHAR(64) NOT NULL,        -- 32 bytes -> Base64
    prf_wrapped_key VARCHAR(255) NOT NULL,-- Encrypted Master Key
    prf_iv VARCHAR(24) NOT NULL,          -- 12 bytes -> Base64

    -- Security Counters & Flags
    signature_count BIGINT DEFAULT 0,
    uv_initialized BOOLEAN DEFAULT FALSE,
    backup_eligible BOOLEAN DEFAULT FALSE,
    backup_state BOOLEAN DEFAULT FALSE,

    -- Attestation
    attestation_object BYTEA,
    attestation_client_data_json BYTEA,

    -- Audit
    created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_used TIMESTAMPTZ,

    -- Foreign Key
    CONSTRAINT fk_user_credentials_users
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

-- Index for fast lookup
CREATE INDEX idx_user_credentials_user_id ON user_credentials(user_id);

CREATE TABLE file_metadata (
    id BIGINT NOT NULL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    blob_id BIGINT,
    original_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(100),
    category VARCHAR(30) NOT NULL DEFAULT 'UNKNOWN',
    parent_id BIGINT,
    is_folder BOOLEAN NOT NULL DEFAULT FALSE,
    is_trashed BOOLEAN NOT NULL DEFAULT FALSE,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ,
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_file_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_file_parent FOREIGN KEY (parent_id) REFERENCES file_metadata(id),
    CONSTRAINT fk_meta_blob FOREIGN KEY (blob_id) REFERENCES file_blobs(id),
    INDEX idx_folder_content (parent_id, is_trashed),
    INDEX idx_user_category (user_id, category, is_trashed)
);

CREATE TABLE file_blobs (
    -- Standard Auto-Increment ID (Internal use only)
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,

    sha256_hash CHAR(100) NOT NULL UNIQUE,

    storage_path VARCHAR(500) NOT NULL,

    size_in_bytes BIGINT NOT NULL,
    content_type VARCHAR(100),

    ref_count BIGINT NOT NULL DEFAULT 1,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);