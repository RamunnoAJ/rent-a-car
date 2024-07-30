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

DROP TABLE IF EXISTS cars;
CREATE TABLE cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year TEXT NOT NULL,
    kms INTEGER NOT NULL,
    color TEXT NOT NULL,
    air_conditioning BOOLEAN,
    seats INTEGER NOT NULL,
    transmission TEXT NOT NULL,
    price INTEGER NOT NULL,
    created_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL
);
