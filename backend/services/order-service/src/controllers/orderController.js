const Order = require("../models/Order");

// ---------- Create Order ----------
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || !totalAmount)
      return res.status(400).json({ error: "Missing order details" });

    const order = new Order({ userId, items, totalAmount });
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- Get Orders by User ----------
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- Update Order Status ----------
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, paymentStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
