const db = require("../configs/db.js");

const selectAllCategories = (search, sort, limit, offset) => {
	return db.query(`
	SELECT * FROM category 
	WHERE category.name LIKE '%${search}%'
	ORDER BY category.name ${sort}
	LIMIT ${limit}
	OFFSET ${offset}; 
	`);
};

const selectCategory = (id) => {
	return db.query(`SELECT * FROM category WHERE id=${id}`);
};

const insertCategory = (data) => {
	const { name, image } = data;

	return db.query(
		`INSERT INTO category (name,image) VALUES( '${name}', '${image}')`,
	);
};

const updateCategory = (data) => {
	const { id, name, image } = data;

	return db.query(
		`UPDATE category SET name='${name}', image='${image}' WHERE id=${id}`,
	);
};

const deleteCategory = (id) => {
	return db.query(`DELETE FROM category WHERE id=${id}`);
};

const countDataCategory = () => {
	return db.query("SELECT COUNT(*) FROM category");
};

module.exports = {
	selectAllCategories,
	selectCategory,
	insertCategory,
	updateCategory,
	deleteCategory,
	countDataCategory,
};
