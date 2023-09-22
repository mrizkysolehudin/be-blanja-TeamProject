const customerModel = require("../models/customerModel.js");
const { response, responseError } = require("../helpers/response.js");
const bcrypt = require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../helpers/jwt.js");
const cloudinary = require("../helpers/cloudinary.js");

const customerController = {
	getAllCustomers: async (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const resultCount = await customerModel.countDataCustomer();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		customerModel
			.selectAllcustomers(search, sort, limit, offset)
			.then((result) => {
				return response(res, result.rows, 200, "Get customers success", pagination);
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getCustomer: async (req, res) => {
		const id = req.params.id;
		customerModel
			.selectCustomer(id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "Customer id is not found");
				}

				return response(res, result.rows, 200, "Get customer success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	deleteCustomer: async (req, res) => {
		const id = req.params.id;

		const { rowCount } = await customerModel.selectCustomer(id);
		if (!rowCount) {
			return responseError(res, 404, "Customer id is not found");
		}

		customerModel
			.deleteCustomer(id)
			.then(() => {
				return response(res, null, 200, "Delete customer success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	registerCustomer: async (req, res) => {
		try {
			const { name, email, password, phone, gender, photo, date_birth, role } =
				req.body;
			const passwordHash = bcrypt.hashSync(password);

			const { rowCount } = await customerModel.findEmailCustomer(email);
			if (rowCount) {
				return responseError(res, 400, "Email already taken.");
			}

			const data = {
				name: name ?? "",
				email,
				password: passwordHash,
				phone: phone ?? "",
				gender: gender ?? "",
				photo:
					photo ??
					"https://res.cloudinary.com/dskltx6xi/image/upload/v1694509756/mama_recipe/users/blank_dd1daa.png",
				date_birth: date_birth ?? "",
				role: role ?? 1,
			};

			const result = await customerModel.insertCustomer(data);
			if (result?.rowCount > 0) {
				return response(res, data, 201, "Register customer success");
			}
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	loginCustomer: async (req, res) => {
		const { email, password } = req.body;

		customerModel
			.findEmailCustomer(email)
			.then((result) => {
				const [customer] = result.rows;

				if (!customer) {
					return responseError(res, 404, "Email not found");
				}

				const checkPassword = bcrypt.compareSync(password, customer.password);
				if (!checkPassword) {
					return responseError(res, 400, "Incorrect password");
				}

				const customerData = {
					id: customer?.id,
					email: customer?.email,
				};

				const payload = {
					customerData,
				};
				const refreshToken = generateRefreshToken(payload);
				const token = generateToken(payload);
				customerData.token = token;
				customerData.refreshToken = refreshToken;

				return response(res, customerData, 200, "Login success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},
};

module.exports = customerController;
