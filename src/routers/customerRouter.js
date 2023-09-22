const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController.js");

router
	.get("/", customerController.getAllCustomers)
	.get("/:id", customerController.getCustomer)
	.delete("/:id", customerController.deleteCustomer)
	.post("/register", customerController.registerCustomer)
	.post("/login", customerController.loginCustomer);

module.exports = router;
