const ordersModel = require("../models/ordersModel.js");
const orderItemsModel = require("../models/orderItemsModel.js");
const { response, responseError } = require("../helpers/response.js");
const cloudinary = require("../helpers/cloudinary.js");
const { v4: uuidv4 } = require("uuid");

const ordersController = {
	getAllOrders: async (req, res) => {
		// let search = req.query.search || "";
		// let sort = req.query.sort || "ASC";

		// let page = parseInt(req.query.page) || 1;
		// let limit = parseInt(req.query.limit) || 10;
		// let offset = (page - 1) * limit;

		// const resultCount = await ordersModel.countDataOrder();
		// const { count } = resultCount.rows[0];

		// const totalData = parseInt(count);
		// const totalPage = Math.ceil(totalData / limit);
		// const pagination = {
		// 	currentPage: page,
		// 	limit,
		// 	totalData,
		// 	totalPage,
		// };

		ordersModel
			.selectAllOrders()
			.then((result) => {
				return response(res, result.rows, 200, "Get orders success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getOrder: async (req, res) => {
		const id = req.params.id;
		ordersModel
			.selectOrder(id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "Order id is not found");
				}

				return response(res, result.rows, 200, "Get order success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	deleteOrder: async (req, res) => {
		const id = req.params.id;

		const { rowCount } = await ordersModel.deleteOrder(id);
		if (!rowCount) {
			return responseError(res, 404, "Order id is not found");
		}

		ordersModel
			.deleteOrder(id)
			.then(() => {
				return response(res, null, 200, "Delete order success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	createOrder: async (req, res) => {
		try {
			const uuid = uuidv4();
			const {
				order_total,
				payment_method,
				address_id,
				customer_id,
				seller_id,
				items,
			} = req.body;

			let orderData = {
				order_id: uuid ?? "",
				order_total: order_total ?? null,
				payment_method: payment_method ?? "OVO",
				address_id: address_id ?? 1,
				customer_id: customer_id ?? 23,
				seller_id: seller_id ?? 5,
			};

			for (const item of items) {
				let orderItemsData = {
					order_id: uuid ?? "",
					product_id: item.product_id ?? 0,
					quantity_unit: item.quantity_unit ?? 0,
					price_unit: item.price_unit ?? 0,
				};

				await orderItemsModel.insertOrderItem(orderItemsData);
			}

			allData = {
				...orderData,
				items,
			};

			const result = await ordersModel.insertOrder(orderData);
			if (result?.rowCount > 0) {
				return response(res, allData, 201, "Create order success");
			}
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	updateOrder: async (req, res) => {
		try {
			const id = req.params.id;
			const { name } = req.body;

			const { rowCount, rows } = await ordersModel.selectOrder(id);
			if (!rowCount) {
				return responseError(res, 404, "Order id is not found");
			}
			const currentOrder = rows[0];

			let imageUrl = currentOrder?.image;
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
				name: name ?? currentOrder?.name,
				image: imageUrl,
			};

			ordersModel
				.updateOrder(data)
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

module.exports = ordersController;
