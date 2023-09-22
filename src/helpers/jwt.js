const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const generateToken = (payload) => {
	const token = jwt.sign(payload, jwtSecretKey, {
		expiresIn: "1h",
	});

	return token;
};

const generateRefreshToken = (payload) => {
	const token = jwt.sign(payload, jwtSecretKey, {
		expiresIn: "10h",
	});

	return token;
};

const verifyToken = (token) => {
	const decoded = jwt.verify(token, jwtSecretKey);

	return decoded;
};

module.exports = {
	generateToken,
	generateRefreshToken,
	verifyToken,
	jwtSecretKey,
};
