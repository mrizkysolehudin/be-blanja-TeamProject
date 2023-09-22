const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController.js");
const { uploadPhotoProfile } = require("../middlewares/uploadImage.js");

router
	.get("/", customerController.getAllCustomers)
	.get("/:id", customerController.getCustomer)
	.delete("/:id", customerController.deleteCustomer)
	.post("/register", customerController.registerCustomer)
	.post("/login", customerController.loginCustomer)
	.put("/:id", uploadPhotoProfile, customerController.updateCustomer);

module.exports = router;
