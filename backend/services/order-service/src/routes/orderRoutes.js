const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Routes
router.post("/create", orderController.createOrder);
router.post("/user", orderController.getOrdersByUser);
router.post("/update_status", orderController.updateOrderStatus);

module.exports = router;
