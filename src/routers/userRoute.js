const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const { uploadPhotoProfile } = require("../middlewares/uploadImage.js");
// const hitById = require("../helpers/hitByRedis.js");
const {
	isLoginAuth,
	adminRoleAuth,
} = require("../middlewares/authMiddleware.js");

router
	.get("/", isLoginAuth, adminRoleAuth, userController.getAllUsers)
	.post("/register", userController.registerUser)
	.post("/login", userController.loginUser)
	.get("/:id", userController.getUser)
	.put("/:id", isLoginAuth, uploadPhotoProfile, userController.updateUser)
	.delete("/:id", isLoginAuth, userController.deleteUser)
	.delete("/photo/:id", isLoginAuth, userController.deleteProfilePhoto);
// .get("/getFromRedis/:id", hitById, userController.getById);

module.exports = router;
