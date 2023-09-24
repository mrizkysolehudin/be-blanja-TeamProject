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

CREATE TABLE
    product (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        image VARCHAR(255),
        price INT,
        color VARCHAR(255),
        size VARCHAR(255),
        stock INT,
        rating VARCHAR(255),
        condition VARCHAR(255),
        description TEXT,
        seller_id INT,
        category_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )

INSERT INTO product (
  name,
  image,
  price,
  color,
  size,
  stock,
  rating,
  condition,
  description,
  seller_id,
  category_id
) VALUES (
  'Sepatu Sneakers',
  'sepatu.jpg',
  49.99,
  'Hitam',
  '9',
  100,
  '4.5',
  'Baru',
  'Sepatu sneakers berkualitas tinggi dengan desain modern.',
  1, 
  2  
  );

UPDATE 
    product 
SET  
    name = 'Adidas Sneakers',
    image = 'adidas-sneakers.jpg', 
    price = 89.99,
    color = 'Black',
    size = '9.5',
    stock = 50,
    condition = 'New',
    description = 'High-quality Adidas sneakers with a modern design.',
    category_id = 3 
WHERE 
    id = 2;
