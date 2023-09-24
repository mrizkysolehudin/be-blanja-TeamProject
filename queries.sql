-- Active: 1692428075479@@localhost@5432@db_blanja
CREATE TABLE
    customer (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        gender VARCHAR(255),
        photo VARCHAR(255),
        date_birth VARCHAR(255)
    )

ALTER TABLE customer add role INT;

CREATE TABLE
    seller (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        photo VARCHAR(255),
        store_name VARCHAR(255),
        store_description VARCHAR(255)
    )

ALTER TABLE seller add role INT;

SELECT seller.id, seller.email FROM seller WHERE email='b';