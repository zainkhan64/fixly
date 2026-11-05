-- POC schema: one tiny table for the "hello from the database" request.
-- Runs automatically the first time the MySQL container starts with an empty volume.
-- The database name must match MYSQL_DATABASE in .env (default: fixly).

CREATE DATABASE IF NOT EXISTS fixly CHARACTER SET utf8mb4;
USE fixly;

CREATE TABLE IF NOT EXISTS poc_messages (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  message    VARCHAR(255) NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
