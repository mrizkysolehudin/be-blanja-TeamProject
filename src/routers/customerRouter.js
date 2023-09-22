const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController.js");

router
	.get("/", customerController.getAllCustomers)
	.get("/:id", customerController.getCustomer)
	.delete("/:id", customerController.deleteCustomer);

module.exports = router;
