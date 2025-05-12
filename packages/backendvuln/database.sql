CREATE DATABASE IF NOT EXISTS loginvuln;

USE loginvuln;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  role VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT INTO users (role, username, password)
VALUES ("admin", "admin", "admin");
