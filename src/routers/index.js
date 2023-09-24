const express = require("express");
const router = express.Router();
const customerRouter = require("./customerRouter");
const sellerRouter = require("./sellerRouter");
const productRouter = require("./productRouter");

router.use("/customer", customerRouter);
router.use("/seller", sellerRouter);
router.use("/product", productRouter);

module.exports = router;
