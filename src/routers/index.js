const express = require("express");
const router = express.Router();
const customerRouter = require("./customerRouter");
const sellerRouter = require("./sellerRouter");
const productRouter = require("./productRouter");
const categoryRouter = require("./categoryRouter");
const ordersRouter = require("./ordersRouter");

router.use("/customer", customerRouter);
router.use("/seller", sellerRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/orders", ordersRouter);

module.exports = router;
