const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController.js");
const { uploadImage } = require("../middlewares/uploadImage.js");

router.get("/", ordersController.getAllOrders);
// router.get("/:id", ordersController.getCategory);
// router.delete("/:id", ordersController.deleteCategory);
router.post("/", ordersController.createOrder);
// router.put("/:id", uploadImage, ordersController.updateCategory);

module.exports = router;
