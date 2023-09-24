const productModel = require("../models/productModel.js");
const { response, responseError } = require("../helpers/response.js");
const bcrypt = require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../helpers/jwt.js");
const cloudinary = require("../helpers/cloudinary.js");

const productController = {
	getAllProducts: async (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const resultCount = await productModel.countDataProduct();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		productModel
			.selectAllProducts(search, sort, limit, offset)
			.then((result) => {
				return response(res, result.rows, 200, "Get products success", pagination);
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getProduct: async (req, res) => {
		const id = req.params.id;
		productModel
			.selectProduct(id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "Product id is not found");
				}

				return response(res, result.rows, 200, "Get product success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	deleteProduct: async (req, res) => {
		const id = req.params.id;

		const { rowCount } = await productModel.deleteProduct(id);
		if (!rowCount) {
			return responseError(res, 404, "Product id is not found");
		}

		productModel
			.deleteProduct(id)
			.then(() => {
				return response(res, null, 200, "Delete product success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	createProduct: async (req, res) => {
		try {
			const {
				name,
				price,
				color,
				size,
				stock,
				rating,
				condition,
				description,
				seller_id,
				category_id,
			} = req.body;

			let imageUrl = "";
			if (req.file) {
				const uploadToCloudinary = await cloudinary.uploader.upload(
					req?.file?.path,
					{
						folder: "blanja/product",
					},
				);

				if (!uploadToCloudinary) {
					return responseError(res, 400, "upload image failed");
				}
				imageUrl = uploadToCloudinary?.secure_url ?? "";
			}

			const data = {
				name: name ?? "",
				image: imageUrl,
				price: price ?? null,
				color: color ?? "",
				size: size ?? "",
				stock: stock ?? null,
				rating: rating ?? "",
				condition: condition ?? "",
				description: description ?? "",
				seller_id: seller_id ?? null,
				category_id: category_id ?? null,
			};

			const result = await productModel.insertProduct(data);
			if (result?.rowCount > 0) {
				return response(res, data, 201, "Create product success");
			}
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	updateProduct: async (req, res) => {
		try {
			const id = req.params.id;
			const {
				name,
				price,
				color,
				size,
				stock,
				rating,
				condition,
				description,
				seller_id,
				category_id,
			} = req.body;

			const { rowCount, rows } = await productModel.selectProduct(id);
			if (!rowCount) {
				return responseError(res, 404, "Product id is not found");
			}

			let imageUrl = "";
			if (req.file) {
				const uploadToCloudinary = await cloudinary.uploader.upload(
					req?.file?.path,
					{
						folder: "blanja/product",
					},
				);

				if (!uploadToCloudinary) {
					return responseError(res, 400, "upload image failed");
				}
				imageUrl = uploadToCloudinary?.secure_url ?? "";
			}

			const currentProduct = rows[0];
			const data = {
				id,
				name: name ?? currentProduct?.name,
				image: imageUrl ?? currentProduct?.image,
				price: price ?? currentProduct?.price,
				color: color ?? currentProduct?.color,
				size: size ?? currentProduct?.size,
				stock: stock ?? currentProduct?.stock,
				rating: rating ?? currentProduct?.rating,
				condition: condition ?? currentProduct?.condition,
				description: description ?? currentProduct?.description,
				category_id: category_id ?? currentProduct?.category_id,
			};

			productModel
				.updateProduct(data)
				.then(() => {
					return response(res, data, 200, "Update product success");
				})
				.catch((error) => {
					return responseError(res, 500, error);
				});
		} catch (error) {
			return responseError(res, 500, error);
		}
	},
};

module.exports = productController;
