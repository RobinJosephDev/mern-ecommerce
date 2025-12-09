const express = require("express");
const router = express.Router();
const { forwardRequest } = require("../utils/serviceProxy");

const CART_SERVICE = process.env.CART_SERVICE;

// GET user cart
router.post("/get", (req, res) => {
  forwardRequest(req, res, `${CART_SERVICE}/get_cart`);
});

// Add item to cart
router.post("/add", (req, res) => {
  forwardRequest(req, res, `${CART_SERVICE}/add_to_cart`);
});

// Remove item from cart
router.post("/remove", (req, res) => {
  forwardRequest(req, res, `${CART_SERVICE}/remove_from_cart`);
});

module.exports = router;
