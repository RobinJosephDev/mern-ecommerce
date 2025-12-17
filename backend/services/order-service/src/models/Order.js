const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "INVENTORY_RESERVED",
        "PAYMENT_PENDING",
        "PAID",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "FAILED",
      ],
      default: "PENDING",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    // protects against duplicate queue processing
    processedEvents: {
      type: [String],
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
