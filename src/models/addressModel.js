const db = require("../configs/db.js");

const selectAllAddress = () => {
	return db.query(`
	SELECT * FROM address 
	`);
};

const selectAddressByCustomerId = (customer_id) => {
	return db.query(`
	SELECT
	address.*
FROM
	address
JOIN
	customer ON  customer.id = address.customer_id 
WHERE
	address.customer_id = ${customer_id};
	`);
};

const selectAddress = (id) => {
	return db.query(`SELECT * FROM address WHERE id=${id}`);
};

const insertAddress = (data) => {
	const {
		customer_id,
		address_type,
		name,
		phone,
		street,
		postal_code,
		city,
		primary_address,
	} = data;

	return db.query(
		`INSERT INTO address (
			customer_id,
			address_type,
			name,
			phone,
			street,
			postal_code,
			city,
			primary_address
			) VALUES(  ${customer_id}, '${address_type}', '${name}', '${phone}', '${street}', '${postal_code}', '${city}', ${primary_address})`,
	);
};

const updateAddress = (data) => {
	const {
		id,
		address_type,
		name,
		phone,
		street,
		postal_code,
		city,
		primary_address,
	} = data;

	return db.query(
		`UPDATE address SET address_type='${address_type}', name='${name}', phone='${phone}', street='${street}', postal_code='${postal_code}', city='${city}', primary_address=${primary_address} WHERE id=${id}`,
	);
};

const deleteAddress = (id) => {
	return db.query(`DELETE FROM address WHERE id=${id}`);
};

const findEmailAddress = (email) => {
	return db.query(`SELECT * FROM address WHERE email='${email}'`);
};

const countDataAddress = () => {
	return db.query("SELECT COUNT(*) FROM address");
};

module.exports = {
	selectAllAddress,
	selectAddressByCustomerId,
	insertAddress,
	// pending
	selectAddress,
	updateAddress,
	deleteAddress,
	findEmailAddress,
	countDataAddress,
};
