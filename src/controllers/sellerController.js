const sellerModel = require("../models/sellerModel.js");
const { response, responseError } = require("../helpers/response.js");
const bcrypt = require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../helpers/jwt.js");
const cloudinary = require("../helpers/cloudinary.js");

const sellerController = {
	getAllSellers: async (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const resultCount = await sellerModel.countDataSeller();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		sellerModel
			.selectAllsellers(search, sort, limit, offset)
			.then((result) => {
				return response(res, result.rows, 200, "Get sellers success", pagination);
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getSeller: async (req, res) => {
		const id = req.params.id;
		sellerModel
			.selectSeller(id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "Seller id is not found");
				}

				return response(res, result.rows, 200, "Get seller success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	deleteSeller: async (req, res) => {
		const id = req.params.id;

		const { rowCount } = await sellerModel.selectSeller(id);
		if (!rowCount) {
			return responseError(res, 404, "Seller id is not found");
		}

		sellerModel
			.deleteSeller(id)
			.then(() => {
				return response(res, null, 200, "Delete seller success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	registerSeller: async (req, res) => {
		try {
			const {
				name,
				email,
				password,
				phone,
				photo,
				store_name,
				store_description,
				role,
			} = req.body;
			const passwordHash = bcrypt.hashSync(password);

			const { rowCount } = await sellerModel.findEmailSeller(email);
			if (rowCount) {
				return responseError(res, 400, "Email already taken.");
			}

			const data = {
				name: name ?? "",
				email,
				password: passwordHash,
				phone: phone ?? "",
				photo:
					photo ??
					"https://res.cloudinary.com/dskltx6xi/image/upload/v1694509756/mama_recipe/users/blank_dd1daa.png",
				store_name: store_name ?? "",
				store_description: store_description ?? "",
				role: role ?? 0,
			};

			const result = await sellerModel.insertSeller(data);
			if (result?.rowCount > 0) {
				return response(res, data, 201, "Register seller success");
			}
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	loginSeller: async (req, res) => {
		const { email, password } = req.body;

		sellerModel
			.findEmailSeller(email)
			.then((result) => {
				const [seller] = result.rows;

				if (!seller) {
					return responseError(res, 404, "Email not found");
				}

				const checkPassword = bcrypt.compareSync(password, seller.password);
				if (!checkPassword) {
					return responseError(res, 400, "Incorrect password");
				}

				const sellerData = {
					id: seller?.id,
					email: seller?.email,
				};

				const payload = {
					sellerData,
				};
				const refreshToken = generateRefreshToken(payload);
				const token = generateToken(payload);
				sellerData.token = token;
				sellerData.refreshToken = refreshToken;

				return res
					.status(200)
					.cookie("refreshToken", refreshToken, {
						// httpOnly: true,
						sameSite: "none",
						secure: true,
					})
					.json({
						message: "Login success",
						data: sellerData,
					});
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	updateSeller: async (req, res) => {
		try {
			const id = req.params.id;
			const { name, email, phone, store_name, store_description, role } = req.body;

			const { rowCount, rows } = await sellerModel.selectSeller(id);
			if (!rowCount) {
				return responseError(res, 404, "Seller id is not found");
			}

			const { rowCount: rowCountEmail, rows: rowsEmail } =
				await sellerModel.findEmailSeller(email);
			if (rowCountEmail && id != rowsEmail[0].id) {
				return responseError(res, 400, "Email already taken.");
			}

			const uploadToCloudinary = await cloudinary.uploader.upload(
				req?.file?.path,
				{
					folder: "blanja/seller",
				},
			);

			if (!uploadToCloudinary) {
				return responseError(res, 400, "Upload image failed");
			}
			const imageUrl = uploadToCloudinary.secure_url;

			const currentSeller = rows[0];
			const data = {
				id,
				name: name ?? currentSeller?.name,
				email: email ?? currentSeller?.email,
				phone: phone ?? currentSeller?.phone,
				photo: imageUrl ?? currentSeller?.photo,
				store_name: store_name ?? currentSeller?.store_name,
				store_description: store_description ?? currentSeller?.store_description,
				role: role ?? currentSeller?.role,
			};

			sellerModel
				.updateSeller(data)
				.then(() => {
					return response(res, data, 200, "Update seller success");
				})
				.catch((error) => {
					return responseError(res, 500, error);
				});
		} catch (error) {
			return responseError(res, 500, error);
		}
	},
};

module.exports = sellerController;
