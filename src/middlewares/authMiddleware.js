const jwt = require("jsonwebtoken");
const { responseError } = require("../helpers/response");
const { jwtSecretKey } = require("../helpers/jwt");

const isLoginAuth = async (req, res, next) => {
	try {
		let token;
		if (req.headers.authorization) {
			let auth = req.headers.authorization;
			token = auth.split(" ")[1];

			let verify = jwt.verify(token, jwtSecretKey);
			req.payload = verify;
			next();
		}

		if (!token) {
			return responseError(res, 400, "access denied");
		}
	} catch (error) {
		if (error && error?.name == "JsonWebTokenError") {
			res.status(404).json({
				message: "Invalid Token",
			});
		} else if (error && error?.name == "TokenExpiredError") {
			let refreshToken = req?.cookies?.refreshToken;

			if (refreshToken) {
				jwt.verify(refreshToken, jwtSecretKey, (err, payload) => {
					if (err) {
						return responseError(res, 400, "token expired");
					}

					const newToken = jwt.sign({ payload }, jwtSecretKey);
					res.setHeader("Authorization", `Bearer ${newToken}`);
					req.payload = jwt.verify(accessToken, jwtSecretKey);
					next();
				});
			} else {
				return responseError(
					res,
					404,
					"Refresh token not found. Please login again...",
				);
			}
		}
	}
};

const adminRoleAuth = (req, res, next) => {
	if (req?.payload?.user?.role === 0) {
		return next();
	} else {
		res.json({
			message: "Halaman ini diakses oleh role admin.",
		});
	}
};

const userRoleAuth = (req, res, next) => {
	if (req?.payload?.user?.role === 1) {
		return next();
	} else {
		res.json({
			message: "Halaman ini diakses oleh role user.",
		});
	}
};

module.exports = {
	isLoginAuth,
	userRoleAuth,
	adminRoleAuth,
};
