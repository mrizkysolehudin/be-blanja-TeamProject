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

CREATE TABLE
    orders (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255),
        order_total VARCHAR(255),
        payment_method VARCHAR(255),
        address_id INT,
        customer_id INT,
        seller_id INT,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id VARCHAR(255),
    product_id INT,
    quantity_unit INT,
    price_unit INT
);


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


CREATE TABLE
    category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        image VARCHAR(255)
    );

INSERT INTO category (
  name,
  image
) VALUES (
  'Electronics',
  ''
  );


SELECT
	product.id,
	product.name AS product_name,
	product.image,
	seller.name AS owner,
	seller.store_name,
	TO_CHAR(product.created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at
FROM
    product
JOIN
	seller ON product.seller_id = seller.id
WHERE
	seller.id = 5; 


    SELECT product.*, seller.store_name,  seller.name AS seller_name, seller.role 
	FROM product
	JOIN seller ON product.seller_id = seller.id  
	WHERE product.id=25;


SELECT
	customer.name AS customer_name,
	product.name AS product_name,
	orders.*,
	order_items.*
FROM
	order_items
JOIN
	orders ON orders.order_id = order_items.order_id
JOIN
	customer ON  customer.id = orders.customer_id 
JOIN
	product ON product.id = order_items.product_id
WHERE
	customer.id = 23; 


    SELECT
	customer.name AS customer_name,
	product.name AS product_name,
	orders.*,
	order_items.*
FROM
	order_items
JOIN
	orders ON orders.order_id = order_items.order_id
JOIN
	customer ON  customer.id = orders.customer_id 
JOIN
	product ON product.id = order_items.product_id
WHERE
	orders.seller_id = 5;


    SELECT product.*, seller.store_name,  seller.name AS seller_name, seller.role 
	FROM product
	JOIN seller ON product.seller_id = seller.id
	WHERE product.category_id=10;