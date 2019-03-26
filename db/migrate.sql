-- User account template
-- DROP TABLES
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `figure`;
DROP TABLE IF EXISTS `figure2user`;
DROP TABLE IF EXISTS `tradeEvent`;
-- DROP TABLE IF EXISTS `figure2user`;

CREATE TABLE IF NOT EXISTS `user` (
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `balance` INT DEFAULT 500,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(`username`)
);

CREATE TABLE IF NOT EXISTS `figure` (
    `name` VARCHAR(100) NOT NULL,
    `value` INT NOT NULL,
    `rate` FLOAT NOT NULL,
    `variance` FLOAT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(`name`)
);

CREATE TABLE IF NOT EXISTS `figure2user` (
    `rowid`    INT,
    `figure_name` VARCHAR(100) NOT NULL,
    `user_username` VARCHAR(255) NOT NULL,
    `count` INT NOT NULL,
    -- `value` INT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`rowid`)
);

CREATE TABLE IF NOT EXISTS `tradeEvent` (
    `rowid` INT,
    `figure_name` VARCHAR(100) NOT NULL,
    `user_username` VARCHAR(255) NOT NULL,
    `count` INT NOT NULL,
    `value` FLOAT NOT NULL,
    `tradeType` CHAR(4),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`rowid`)
);

-- DELETE FROM `user`;
INSERT INTO `user` (`username`, `password`) VALUES ("test", "test2");

-- DELETE FROM `figure`;
INSERT INTO `figure` (`name`, `value`, `rate`, `variance`) VALUES
    ("Flash", 30, 1, 1.54),
    ("Batman", 20, 1, 1.54)
;

SELECT * FROM `figure`;
-- DELETE FROM `figure2user`;
SELECT * FROM `figure2user`;

-- INSERT INTO `figure2user` (`figure_name`, `user_username`, `count`) VALUES
--     ("Flash", "test", 5),
--     ("Batman", "test", 2)
-- ;

-- SELECT * FROM `asdf`;