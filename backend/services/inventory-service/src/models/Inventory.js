const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model("Inventory", InventorySchema);
