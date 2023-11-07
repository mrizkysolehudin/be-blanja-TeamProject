const db = require("../configs/db.js");

const selectAllProducts = (search, sort, limit, offset) => {
	return db.query(`
	SELECT product.*, seller.store_name,  seller.name AS seller_name, seller.role 
	FROM product
	JOIN seller ON product.seller_id = seller.id 
	WHERE product.name ILIKE '%${search}%'
	ORDER BY product.name ${sort}
	LIMIT ${limit}
	OFFSET ${offset}; 
	`);
};

const selectAllProductsByCategoryId = (category_id, limit, offset) => {
	return db.query(`
	SELECT product.*, seller.store_name,  seller.name AS seller_name, seller.role 
	FROM product
	JOIN seller ON product.seller_id = seller.id
	WHERE product.category_id=${category_id} 
	LIMIT ${limit}
	OFFSET ${offset}; 
	`);
};

const selectProduct = (id) => {
	return db.query(`SELECT product.*, seller.store_name,  seller.name AS seller_name, seller.role 
	FROM product
	JOIN seller ON product.seller_id = seller.id  
	WHERE product.id=${id}`);
};

const insertProduct = (data) => {
	const {
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
		category_id,
	} = data;

	return db.query(
		`INSERT INTO product (
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
    ) VALUES( '${name}', '${image}', ${price}, '${color}', '${size}', ${stock},'${rating}', '${condition}', '${description}', ${seller_id}, ${category_id})`,
	);
};

const updateProduct = (data) => {
	const {
		id,
		name,
		image,
		price,
		color,
		size,
		stock,
		rating,
		condition,
		description,
		category_id,
	} = data;

	return db.query(
		`UPDATE 
			product 
		SET  
			name = '${name}',
			image = '${image}', 
			price = ${price},
			color = '${color}',
			size = '${size}',
			stock = ${stock},
			rating = ${rating},
			condition = '${condition}',
			description = '${description}',
			category_id = ${category_id} 
		WHERE 
			id=${id}`,
	);
};

const deleteProduct = (id) => {
	return db.query(`DELETE FROM product WHERE id=${id}`);
};

const countDataProduct = (search) => {
	return db.query(`SELECT COUNT(*) 
	FROM product 
	JOIN seller ON product.seller_id = seller.id 
	WHERE product.name ILIKE '%${search}%'
	`);
};

const selectProductsUserByUserId = (id) => {
	return db.query(`
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
	seller.id = ${id};
	`);
};

module.exports = {
	selectAllProducts,
	selectAllProductsByCategoryId,
	selectProduct,
	insertProduct,
	updateProduct,
	deleteProduct,
	countDataProduct,
	selectProductsUserByUserId,
};
