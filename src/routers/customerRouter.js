const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController.js");

router.get("/", customerController.getAllCustomers);

module.exports = router;
