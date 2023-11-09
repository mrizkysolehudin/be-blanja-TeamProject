const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController.js");
const { uploadImage } = require("../middlewares/uploadImage.js");

router.get("/", addressController.getAllAddress);
router.get(
	"/address-customer/:customer_id",
	addressController.getAddressByCustomerId,
);
// router.get("/:id", addressController.getCategory);
// router.delete("/:id", addressController.deleteCategory);
router.post("/", addressController.createAddress);
router.put("/:id", addressController.updateAddress);

module.exports = router;
