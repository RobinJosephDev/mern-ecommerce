const express = require("express");
const router = express.Router();
const { forwardRequest } = require("../utils/serviceProxy");

const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE;

// Create Razorpay order
router.post("/create", (req, res) => {
  forwardRequest(req, res, `${PAYMENT_SERVICE}/payments/create_order`);
});

// Verify Razorpay payment
router.post("/verify", (req, res) => {
  forwardRequest(req, res, `${PAYMENT_SERVICE}/payments/verify`);
});

module.exports = router;
