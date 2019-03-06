-- User account template
-- DROP TABLES
DROP TABLE IF EXISTS `user`;

CREATE TABLE IF NOT EXISTS `user` (
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `balance` INT DEFAULT 100,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(`username`)
);

DELETE FROM `user`;
INSERT INTO `user` (`username`, `password`) VALUES ("test", "test2");