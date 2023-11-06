const orderItemsModel = require("../models/orderItemsModel.js");
const customerModel = require("../models/customerModel.js");
const { response, responseError } = require("../helpers/response.js");
const cloudinary = require("../helpers/cloudinary.js");
const { v4: uuidv4 } = require("uuid");

const orderItemsController = {
	getAllOrderItems: async (req, res) => {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const resultCount = await orderItemsModel.countDataOrderItem();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		orderItemsModel
			.selectAllOrderItems(limit, offset)
			.then((result) => {
				return response(
					res,
					result.rows,
					200,
					"Get orderItems success",
					pagination,
				);
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getOrderItemsByCustomerId: async (req, res) => {
		try {
			const customer_id = req.params.customer_id;

			const { rowCount } = await customerModel.selectCustomer(customer_id);
			if (!rowCount) {
				return responseError(res, 404, "Customer id is not found");
			}

			orderItemsModel
				.selectOrderItemsByCustomerId(customer_id)
				.then((result) => {
					return response(res, result.rows, 200, "get order items customer success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	// pending
	getOrderItem: async (req, res) => {
		const id = req.params.id;
		orderItemsModel
			.selectOrderItem(id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "OrderItem id is not found");
				}

				return response(res, result.rows, 200, "Get order success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	deleteOrderItem: async (req, res) => {
		const id = req.params.id;

		const { rowCount } = await orderItemsModel.deleteOrderItem(id);
		if (!rowCount) {
			return responseError(res, 404, "OrderItem id is not found");
		}

		orderItemsModel
			.deleteOrderItem(id)
			.then(() => {
				return response(res, null, 200, "Delete order success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	updateOrderItem: async (req, res) => {
		try {
			const id = req.params.id;
			const { name } = req.body;

			const { rowCount, rows } = await orderItemsModel.selectOrderItem(id);
			if (!rowCount) {
				return responseError(res, 404, "OrderItem id is not found");
			}
			const currentOrderItem = rows[0];

			let imageUrl = currentOrderItem?.image;
			if (req.file) {
				const uploadToCloudinary = await cloudinary.uploader.upload(
					req?.file?.path,
					{
						folder: "blanja/order",
					},
				);

				if (!uploadToCloudinary) {
					return responseError(res, 400, "upload image failed");
				}
				imageUrl = uploadToCloudinary?.secure_url ?? "";
			}

			const data = {
				id,
				name: name ?? currentOrderItem?.name,
				image: imageUrl,
			};

			orderItemsModel
				.updateOrderItem(data)
				.then(() => {
					return response(res, data, 200, "Update order success");
				})
				.catch((error) => {
					return responseError(res, 500, error);
				});
		} catch (error) {
			return responseError(res, 500, error);
		}
	},
};

module.exports = orderItemsController;
