const addressModel = require("../models/addressModel.js");
const customerModel = require("../models/customerModel.js");
const { response, responseError } = require("../helpers/response.js");
const cloudinary = require("../helpers/cloudinary.js");
const { v4: uuidv4 } = require("uuid");

const addressController = {
	getAllAddress: async (req, res) => {
		// let search = req.query.search || "";
		// let sort = req.query.sort || "ASC";

		// let page = parseInt(req.query.page) || 1;
		// let limit = parseInt(req.query.limit) || 10;
		// let offset = (page - 1) * limit;

		// const resultCount = await addressModel.countDataAddress();
		// const { count } = resultCount.rows[0];

		// const totalData = parseInt(count);
		// const totalPage = Math.ceil(totalData / limit);
		// const pagination = {
		// 	currentPage: page,
		// 	limit,
		// 	totalData,
		// 	totalPage,
		// };

		addressModel
			.selectAllAddress()
			.then((result) => {
				return response(res, result.rows, 200, "Get address success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getAddressByCustomerId: async (req, res) => {
		try {
			const customer_id = req.params.customer_id;

			const { rowCount } = await customerModel.selectCustomer(customer_id);
			if (!rowCount) {
				return responseError(res, 404, "Customer id is not found");
			}

			addressModel
				.selectAddressByCustomerId(customer_id)
				.then((result) => {
					return response(res, result.rows, 200, "get address customer success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	getAddress: async (req, res) => {
		const id = req.params.id;
		addressModel
			.selectAddress(id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "Address id is not found");
				}

				return response(res, result.rows, 200, "Get address success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	deleteAddress: async (req, res) => {
		const id = req.params.id;

		const { rowCount } = await addressModel.deleteAddress(id);
		if (!rowCount) {
			return responseError(res, 404, "Address id is not found");
		}

		addressModel
			.deleteAddress(id)
			.then(() => {
				return response(res, null, 200, "Delete address success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	createAddress: async (req, res) => {
		try {
			const {
				customer_id,
				address_type,
				name,
				phone,
				street,
				postal_code,
				city,
				primary_address,
			} = req.body;

			let data = {
				customer_id: customer_id ?? null,
				address_type: address_type ?? "",
				name: name ?? "",
				phone: phone ?? "",
				street: street ?? "",
				postal_code: postal_code ?? "",
				city: city ?? "",
				primary_address: primary_address ?? false,
			};

			const result = await addressModel.insertAddress(data);
			if (result?.rowCount > 0) {
				return response(res, data, 201, "Create address success");
			}
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	updateAddress: async (req, res) => {
		try {
			const id = req.params.id;
			const {
				address_type,
				name,
				phone,
				street,
				postal_code,
				city,
				primary_address,
			} = req.body;

			const { rowCount, rows } = await addressModel.selectAddress(id);
			if (!rowCount) {
				return responseError(res, 404, "Address id is not found");
			}
			const currentAddress = rows[0];

			const data = {
				id,
				address_type: address_type ?? currentAddress.address_type,
				name: name ?? currentAddress.name,
				phone: phone ?? currentAddress.phone,
				street: street ?? currentAddress.street,
				postal_code: postal_code ?? currentAddress.postal_code,
				city: city ?? currentAddress.city,
				primary_address: primary_address ?? currentAddress.primary_address,
			};

			addressModel
				.updateAddress(data)
				.then(() => {
					return response(res, data, 200, "Update address success");
				})
				.catch((error) => {
					return responseError(res, 500, error);
				});
		} catch (error) {
			return responseError(res, 500, error);
		}
	},
};

module.exports = addressController;
