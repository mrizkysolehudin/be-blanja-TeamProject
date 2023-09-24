const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController.js");
const { uploadPhotoProfile } = require("../middlewares/uploadImage.js");

router
	.get("/", sellerController.getAllSellers)
	.get("/:id", sellerController.getSeller)
	.delete("/:id", sellerController.deleteSeller)
	.post("/register", sellerController.registerSeller)
	.post("/login", sellerController.loginSeller)
	.put("/:id", uploadPhotoProfile, sellerController.updateSeller);

module.exports = router;
