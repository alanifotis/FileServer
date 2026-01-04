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
    security_stamp BIGINT NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'FREE' NOT NULL, 
    storage_used_bytes BIGINT DEFAULT 0 NOT NULL,
    root_folder_id BIGINT NOT NULL,
    registred_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index for fast login lookups
CREATE INDEX idx_users_email ON users(email);

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
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,

    -- Foreign Key
    CONSTRAINT fk_user_credentials_users
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

-- Index for fast lookup
CREATE INDEX idx_user_credentials_user_id ON user_credentials(user_id);