/* create table user_credentials
(
    credential_id                varchar(1000) not null,
    user_entity_user_id          varchar(1000) not null,
    public_key                   bytea         not null,
    signature_count              bigint,
    uv_initialized               boolean,
    backup_eligible              boolean       not null,
    authenticator_transports     varchar(1000),
    public_key_credential_type   varchar(100),
    backup_state                 boolean       not null,
    attestation_object           bytea,
    attestation_client_data_json bytea,
    created                      timestamp,
    last_used                    timestamp,
    label                        varchar(1000) not null,
    primary key (credential_id)
);

CREATE TABLE user_credentials (
    -- The unique Credential ID (Base64URL encoded string from the authenticator)
    credential_id                VARCHAR(1000) NOT NULL PRIMARY KEY,

    -- CHANGED: Strictly typed link to your User Snowflake ID
    user_id                      BIGINT NOT NULL,

    -- Passkey Metadata
    label                        VARCHAR(255) NOT NULL,
    public_key                   BYTEA NOT NULL,
    authenticator_transports     VARCHAR(255), -- stored as comma-separated values

    -- Security Counters & Flags
    signature_count              BIGINT DEFAULT 0,
    uv_initialized               BOOLEAN DEFAULT FALSE, -- User Verification (Biometrics)
    backup_eligible              BOOLEAN DEFAULT FALSE, -- Synced? (e.g. iCloud)
    backup_state                 BOOLEAN DEFAULT FALSE, -- Currently backed up?

    -- Attestation (Required for auditing/registration validation)
    attestation_object           BYTEA,
    attestation_client_data_json BYTEA,

    -- Audit
    created                      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used                    TIMESTAMP,

    -- Foreign Key Constraint
    CONSTRAINT fk_user_credentials_users
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

-- Index for fast login lookups
CREATE INDEX idx_user_credentials_user_id ON user_credentials(user_id);

create table user_entities
(
    id           varchar(1000) not null,
    name         varchar(100)  not null,
    display_name varchar(200),
    primary key (id)
);

*/

/* * 1. USERS TABLE 
 * Matches the User.java @Entity definition using Snowflake ID (BIGINT) 
 */
CREATE TABLE users (
    -- Snowflake ID (Long in Java)
    id BIGINT NOT NULL PRIMARY KEY,

    -- Core Identity
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255),
    avatar_url VARCHAR(255),
    locale VARCHAR(10) DEFAULT 'en-US',

    -- Security
    -- 'roles' maps to private String roles = "USER";
    roles VARCHAR(50) DEFAULT 'USER' NOT NULL,
    -- 'security_stamp' is used to invalidate JWTs/Sessions instantly
    security_stamp BIGINT NOT NULL,

    -- File Server Specifics
    plan_tier VARCHAR(50) DEFAULT 'FREE',
    storage_used_bytes BIGINT DEFAULT 0 NOT NULL,
    root_folder_id BIGINT
);

-- Index for fast login lookups by email
CREATE INDEX idx_users_email ON users(email);


/* * 2. WEB_AUTHN CREDENTIALS TABLE
 * Stores Passkeys linked strictly to the users table
 */
CREATE TABLE user_credentials (
    -- The unique Credential ID (Base64URL encoded string from the authenticator)
    credential_id VARCHAR(300) NOT NULL PRIMARY KEY,

    -- LINK TO USERS TABLE (Snowflake ID)
    user_id BIGINT NOT NULL,

    -- Passkey Metadata
    label VARCHAR(255) NOT NULL,
    public_key BYTEA NOT NULL,                 -- The raw public key
    authenticator_transports VARCHAR(255),     -- 'usb,nfc,internal'

    -- Security Counters & Flags
    signature_count BIGINT DEFAULT 0,
    uv_initialized BOOLEAN DEFAULT FALSE,      -- User Verification (Biometrics)
    backup_eligible BOOLEAN DEFAULT FALSE,     -- Synced? (e.g. iCloud)
    backup_state BOOLEAN DEFAULT FALSE,        -- Currently backed up?

    -- Attestation (Required for auditing/registration validation)
    attestation_object BYTEA,
    attestation_client_data_json BYTEA,

    -- Audit
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,

    -- STRICT FOREIGN KEY CONSTRAINT
    -- If a user is deleted, their passkeys are automatically wiped.
    CONSTRAINT fk_user_credentials_users
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

-- Index for fast credential lookups during login
CREATE INDEX idx_user_credentials_user_id ON user_credentials(user_id);