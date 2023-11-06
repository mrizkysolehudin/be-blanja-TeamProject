const express = require("express");
const router = express.Router();
const orderItemsController = require("../controllers/orderItemsController.js");
const { uploadImage } = require("../middlewares/uploadImage.js");

router.get("/", orderItemsController.getAllOrderItems);
router.get(
	"/orderitems-customer/:customer_id",
	orderItemsController.getOrderItemsByCustomerId,
);
// router.get("/:id", ordersController.getCategory);
// router.delete("/:id", ordersController.deleteCategory);
// router.put("/:id", uploadImage, ordersController.updateCategory);

module.exports = router;
