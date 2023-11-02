const orderItemsModel = require("../models/orderItemsModel.js");
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

	createOrderItem: async (req, res) => {
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
					quantity_unit: item.price_unit ?? 0,
					price_unit: item.price_unit ?? 0,
				};

				await orderItemsModel.insertOrderItemItem(orderItemsData);
			}

			allData = {
				...orderData,
				items,
			};

			const result = await orderItemsModel.insertOrderItem(orderData);
			if (result?.rowCount > 0) {
				return response(res, allData, 201, "Create order success");
			}
		} catch (error) {
			return responseError(res, 500, error.message);
		}
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
