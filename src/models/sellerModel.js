const db = require("../configs/db.js");

const selectAllsellers = (search, sort, limit, offset) => {
	return db.query(`
	SELECT * FROM seller 
	WHERE seller.store_name LIKE '%${search}%'
	ORDER BY seller.store_name ${sort}
	LIMIT ${limit}
	OFFSET ${offset}; 
	`);
};

const selectSeller = (id) => {
	return db.query(`SELECT * FROM seller WHERE id=${id}`);
};

const insertSeller = (data) => {
	const {
		name,
		email,
		password,
		phone,
		photo,
		store_name,
		store_description,
		role,
	} = data;

	return db.query(
		`INSERT INTO seller (name,email,password,phone,photo,store_name,store_description,role) VALUES( '${name}', '${email}', '${password}', '${phone}', '${photo}', '${store_name}','${store_description}', ${role})`,
	);
};

const updateSeller = (data) => {
	const { id, name, email, phone, photo, store_name, store_description, role } =
		data;

	return db.query(
		`UPDATE seller SET name='${name}', email='${email}', phone='${phone}', photo='${photo}', store_name='${store_name}', store_description='${store_description}', role=${role} WHERE id=${id}`,
	);
};

const deleteSeller = (id) => {
	return db.query(`DELETE FROM seller WHERE id=${id}`);
};

const findEmailSeller = (email) => {
	return db.query(`SELECT * FROM seller WHERE email='${email}'`);
};

const countDataSeller = () => {
	return db.query("SELECT COUNT(*) FROM seller");
};

module.exports = {
	selectAllsellers,
	selectSeller,
	insertSeller,
	updateSeller,
	deleteSeller,
	findEmailSeller,
	countDataSeller,
};
