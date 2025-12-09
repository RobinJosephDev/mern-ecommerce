const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/create_order", paymentController.createOrder);
router.post("/verify", paymentController.verifyPayment);

module.exports = router;
