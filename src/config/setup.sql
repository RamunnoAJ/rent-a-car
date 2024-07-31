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

DROP TABLE IF EXISTS reservations;
CREATE TABLE reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    days INTEGER NOT NULL,
    baby_chair BOOLEAN NOT NULL,
    snow_chain BOOLEAN,
    payment_method TEXT NOT NULL,
    total_price INTEGER NOT NULL,
    fk_car_id INTEGER NOT NULL REFERENCES cars(id),
    fk_user_id INTEGER NOT NULL REFERENCES users(id),
    created_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL
);
