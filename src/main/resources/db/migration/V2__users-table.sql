--- Spring Security JDBC DDL
CREATE TABLE IF NOT EXISTS users
(
    username TEXT    NOT NULL PRIMARY KEY,
    password TEXT    NOT NULL,
    enabled  BOOLEAN NOT NULL
);
CREATE TABLE IF NOT EXISTS authorities
(
    username  TEXT NOT NULL,
    authority TEXT NOT NULL,
    CONSTRAINT fk_authorities_users FOREIGN KEY (username) REFERENCES users (username)
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_auth_username ON authorities (username, authority);
