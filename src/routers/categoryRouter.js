const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController.js");
const { uploadImage } = require("../middlewares/uploadImage.js");

router
	.get("/", categoryController.getAllCategories)
	.get("/:id", categoryController.getCategory)
	.delete("/:id", categoryController.deleteCategory)
	.post("/", uploadImage, categoryController.createCategory)
	.put("/:id", uploadImage, categoryController.updateCategory);

module.exports = router;
