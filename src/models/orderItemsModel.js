const db = require("../configs/db.js");

const selectAllOrderItems = (limit, offset) => {
	return db.query(`
	SELECT order_items.*, product.name AS product_name FROM order_Items 
	JOIN product ON order_items.product_id = product.id
	LIMIT ${limit}
	OFFSET ${offset}; 
	`);
};

const selectOrderItemsByCustomerId = (customer_id) => {
	return db.query(`
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
	customer.id = ${customer_id};
	`);
};

const selectOrderItemsBySellerId = (seller_id) => {
	return db.query(`
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
	orders.seller_id = ${seller_id};
	`);
};

// pending
const selectOrderItem = (id) => {
	return db.query(`SELECT * FROM order_Items WHERE id=${id}`);
};

const insertOrderItem = (data) => {
	const { order_id, product_id, quantity_unit, price_unit } = data;

	return db.query(
		`INSERT INTO order_Items (order_id, product_id, quantity_unit, price_unit) VALUES( '${order_id}', ${product_id}, ${quantity_unit}, ${price_unit})`,
	);
};

const updateOrderItem = (data) => {
	const { id, name, image } = data;

	return db.query(
		`UPDATE order_Items SET name='${name}', image='${image}' WHERE id=${id}`,
	);
};

const deleteOrderItem = (id) => {
	return db.query(`DELETE FROM order_Items WHERE id=${id}`);
};

const countDataOrderItem = () => {
	return db.query("SELECT COUNT(*) FROM order_Items");
};

module.exports = {
	selectAllOrderItems,
	selectOrderItemsByCustomerId,
	selectOrderItemsBySellerId,
	// pending
	selectOrderItem,
	insertOrderItem,
	updateOrderItem,
	deleteOrderItem,
	countDataOrderItem,
};
