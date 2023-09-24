const categoryModel = require("../models/categoryModel.js");
const { response, responseError } = require("../helpers/response.js");
const cloudinary = require("../helpers/cloudinary.js");

const categoryController = {
	getAllCategories: async (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const resultCount = await categoryModel.countDataCategory();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		categoryModel
			.selectAllCategories(search, sort, limit, offset)
			.then((result) => {
				return response(
					res,
					result.rows,
					200,
					"Get categories success",
					pagination,
				);
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getCategory: async (req, res) => {
		const id = req.params.id;
		categoryModel
			.selectCategory(id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "Category id is not found");
				}

				return response(res, result.rows, 200, "Get category success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	deleteCategory: async (req, res) => {
		const id = req.params.id;

		const { rowCount } = await categoryModel.deleteCategory(id);
		if (!rowCount) {
			return responseError(res, 404, "Category id is not found");
		}

		categoryModel
			.deleteCategory(id)
			.then(() => {
				return response(res, null, 200, "Delete category success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	createCategory: async (req, res) => {
		try {
			const { name } = req.body;

			let imageUrl = "";
			if (req.file) {
				const uploadToCloudinary = await cloudinary.uploader.upload(
					req?.file?.path,
					{
						folder: "blanja/category",
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
			};

			const result = await categoryModel.insertCategory(data);
			if (result?.rowCount > 0) {
				return response(res, data, 201, "Create category success");
			}
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	updateCategory: async (req, res) => {
		try {
			const id = req.params.id;
			const { name } = req.body;

			const { rowCount, rows } = await categoryModel.selectCategory(id);
			if (!rowCount) {
				return responseError(res, 404, "Category id is not found");
			}
			const currentCategory = rows[0];

			let imageUrl = currentCategory?.image;
			if (req.file) {
				const uploadToCloudinary = await cloudinary.uploader.upload(
					req?.file?.path,
					{
						folder: "blanja/category",
					},
				);

				if (!uploadToCloudinary) {
					return responseError(res, 400, "upload image failed");
				}
				imageUrl = uploadToCloudinary?.secure_url ?? "";
			}

			const data = {
				id,
				name: name ?? currentCategory?.name,
				image: imageUrl,
			};

			categoryModel
				.updateCategory(data)
				.then(() => {
					return response(res, data, 200, "Update category success");
				})
				.catch((error) => {
					return responseError(res, 500, error);
				});
		} catch (error) {
			return responseError(res, 500, error);
		}
	},
};

module.exports = categoryController;
