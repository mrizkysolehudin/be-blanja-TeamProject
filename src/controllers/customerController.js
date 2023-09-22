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
};

module.exports = customerController;
