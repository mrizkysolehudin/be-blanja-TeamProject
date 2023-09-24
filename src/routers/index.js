const express = require("express");
const router = express.Router();
const customerRouter = require("./customerRouter");
const sellerRouter = require("./sellerRouter");

router.use("/customer", customerRouter);
router.use("/seller", sellerRouter);

module.exports = router;
