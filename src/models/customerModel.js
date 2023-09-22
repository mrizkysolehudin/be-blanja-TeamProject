const db = require("../configs/db.js");

const selectAllcustomers = (search, sort, limit, offset) => {
	return db.query(`
	SELECT * FROM customer 
	WHERE customer.name LIKE '%${search}%'
	ORDER BY customer.name ${sort}
	LIMIT ${limit}
	OFFSET ${offset}; 
	`);
};

const selectCustomerId = (id) => {
	return db.query(`SELECT * FROM customer WHERE id=${id}`);
};

const insertCustomer = (data) => {
	const { name, email, password, phone, gender, photo, date_birth, role } = data;

	return db.query(
		`INSERT INTO customer (name,email,password,phone,gender,photo,date_birth,role) VALUES( '${name}', '${email}', '${password}', '${phone}','${gender}', '${photo}', '${date_birth}', '${role}')`,
	);
};

const updateCustomer = (data) => {
	const { id, name, email, phone, gender, photo, date_birth, role } = data;

	return db.query(
		`UPDATE customer SET name='${name}', email='${email}', phone='${phone}', gender='${gender}', photo='${photo}', date_birth='${date_birth}', role=${role} WHERE id=${id}`,
	);
};

const deleteCustomer = (id) => {
	return db.query(`DELETE FROM customer WHERE id=${id}`);
};

const findEmailCustomer = (email) => {
	return db.query(`SELECT * FROM customer WHERE email='${email}'`);
};

const countDataCustomer = () => {
	return db.query("SELECT COUNT(*) FROM customer");
};

module.exports = {
	selectAllcustomers,
	selectCustomerId,
	insertCustomer,
	updateCustomer,
	deleteCustomer,
	findEmailCustomer,
	countDataCustomer,
};
