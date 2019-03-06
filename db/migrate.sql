-- User account template
-- DROP TABLES
DROP TABLE IF EXISTS user;

CREATE TABLE IF NOT EXISTS user (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(email)
);

DELETE FROM user;
INSERT INTO user (email, password) VALUES ("test", "test2");