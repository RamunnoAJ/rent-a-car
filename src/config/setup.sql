DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    token TEXT NOT NULL,
    phone TEXT NOT NULL,
    name TEXT NOT NULL,
    nationality TEXT NOT NULL,
    address TEXT NOT NULL,
    driver_license TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL
);
