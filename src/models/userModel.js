const db = require("../configs/db.js");

const selectAllusers = (search, sort, limit, offset) => {
	return db.query(`
	SELECT * FROM users 
	WHERE users.name LIKE '%${search}%'
	ORDER BY users.name ${sort}
	LIMIT ${limit}
	OFFSET ${offset}; 
	`);
};

const selectUser = (user_id) => {
	return db.query(`SELECT * FROM users WHERE user_id=${user_id}`);
};

const insertUser = (data) => {
	const { name, email, phone, password, confirmPassword, photo, role } = data;

	return db.query(
		`INSERT INTO users (name,email,phone,password,confirmPassword,photo,role) VALUES( '${name}', '${email}', '${phone}', '${password}', '${confirmPassword}', '${photo}', '${role}')`,
	);
};

const updateUser = (data) => {
	const { user_id, name, email, phone, photo, role } = data;
	return db.query(
		`UPDATE users SET name='${name}', email='${email}', phone='${phone}', photo='${photo}', role=${role}  WHERE user_id=${user_id}`,
	);
};

const deleteUser = (user_id) => {
	return db.query(`DELETE FROM users WHERE user_id=${user_id}`);
};

const findEmail = (email) => {
	return db.query(`SELECT * FROM users WHERE email='${email}'`);
};

const deletePhotoUser = (userId) => {
	return db.query(
		`UPDATE users SET photo = "https://res.cloudinary.com/dskltx6xi/image/upload/v1694509756/mama_recipe/users/blank_dd1daa.png" WHERE user_id=${userId}`,
	);
};

const countDataUsers = () => {
	return db.query("SELECT COUNT(*) FROM users");
};

module.exports = {
	selectAllusers,
	selectUser,
	insertUser,
	updateUser,
	deleteUser,
	findEmail,
	deletePhotoUser,
	countDataUsers,
};
