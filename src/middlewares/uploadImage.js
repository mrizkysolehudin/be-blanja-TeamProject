const path = require("path");
const multer = require("multer");
const { responseError } = require("../helpers/response");

const multerUpload = multer({
	storage: multer.diskStorage({
		// destination: function (req, file, cb) {
		// 	cb(null, "./public");
		// },
		filename: function (req, file, cb) {
			const ext = path.extname(file.originalname);
			const fileName = `${Date.now()}${ext}`;
			cb(null, fileName);
		},
	}),

	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname);

		if (ext == ".png" || ext == ".jpg" || ext == ".jpeg") {
			cb(null, true);
		} else {
			const errMessage = {
				message: "File must be a .PNG, .JPG, or .JPEG",
			};

			return cb(errMessage, false);
		}

		const fileSize = parseInt(req.headers["content-length"]);
		const maxSize = 2 * 1024 * 1024;
		if (fileSize < maxSize) {
			cb(null, true);
		} else {
			const errMessage = {
				message: "File size should be less than 2MB",
			};

			return cb(errMessage, false);
		}
	},
});

const uploadImageRecipe = (req, res, next) => {
	const multerSingle = multerUpload.single("image");

	multerSingle(req, res, (err) => {
		if (err) {
			return responseError(res, 413, "Error when upload file: " + err.message);
		} else {
			next();
		}
	});
};

const uploadPhotoProfile = (req, res, next) => {
	const multerSingle = multerUpload.single("photo");

	multerSingle(req, res, (err) => {
		if (err) {
			return responseError(res, 413, "Error when upload file: " + err.message);
		} else {
			next();
		}
	});
};

module.exports = { uploadImageRecipe, uploadPhotoProfile };
