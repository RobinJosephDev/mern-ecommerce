const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: { type: Object, required: true }, // itemId: quantity
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "pending" }, // pending, confirmed, shipped, delivered
  paymentStatus: { type: String, default: "unpaid" }, // unpaid, paid
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
