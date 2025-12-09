const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Routes
router.post("/get", cartController.getCart);
router.post("/add", cartController.addToCart);
router.post("/remove", cartController.removeFromCart);

module.exports = router;
