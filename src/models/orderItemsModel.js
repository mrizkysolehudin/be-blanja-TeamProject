const db = require("../configs/db.js");

const selectAllOrderItems = (limit, offset) => {
	return db.query(`
	SELECT order_items.*, product.name AS product_name FROM order_Items 
	JOIN product ON order_items.product_id = product.id
	LIMIT ${limit}
	OFFSET ${offset}; 
	`);
};

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
	// pending
	selectOrderItem,
	insertOrderItem,
	updateOrderItem,
	deleteOrderItem,
	countDataOrderItem,
};
