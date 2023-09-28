const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js");
const { uploadImage } = require("../middlewares/uploadImage.js");

router
	.get("/", productController.getAllProducts)
	.get("/:id", productController.getProduct)
	.delete("/:id", productController.deleteProduct)
	.post("/", uploadImage, productController.createProduct)
	.put("/:id", uploadImage, productController.updateProduct)
	.get("/seller-products/:id", productController.getProductsUserByUserId);

module.exports = router;
