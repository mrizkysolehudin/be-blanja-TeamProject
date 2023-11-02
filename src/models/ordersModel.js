const db = require("../configs/db.js");

const selectAllOrders = () => {
	return db.query(`
	SELECT * FROM orders 
	`);
};

// const selectAllOrdersWithOrderItems = () => {
// 	return db.query(`
// 		SELECT o.*, oi.*, p.product_name
// 		FROM orders o
// 		LEFT JOIN order_items oi ON o.order_id = oi.order_id
// 		LEFT JOIN products p ON oi.product_id = p.product_id
// 	`);
// };

const selectOrder = (id) => {
	return db.query(`SELECT * FROM orders WHERE id=${id}`);
};

const insertOrder = (data) => {
	const {
		order_id,
		order_total,
		payment_method,
		address_id,
		customer_id,
		seller_id,
	} = data;

	return db.query(
		`INSERT INTO orders (order_id, order_total, payment_method, address_id, customer_id, seller_id, order_date) VALUES( '${order_id}', ${order_total}, '${payment_method}', ${address_id}, ${customer_id}, ${seller_id}, CURRENT_TIMESTAMP)`,
	);
};

const updateOrder = (data) => {
	const { id, name, image } = data;

	return db.query(
		`UPDATE orders SET name='${name}', image='${image}' WHERE id=${id}`,
	);
};

const deleteOrder = (id) => {
	return db.query(`DELETE FROM orders WHERE id=${id}`);
};

const countDataOrder = () => {
	return db.query("SELECT COUNT(*) FROM orders");
};

module.exports = {
	selectAllOrders,
	selectOrder,
	insertOrder,
	updateOrder,
	deleteOrder,
	countDataOrder,
};
