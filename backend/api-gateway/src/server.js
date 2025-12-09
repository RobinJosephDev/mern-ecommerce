// api-gateway/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// ---------- Middleware ----------
app.use(express.json({ limit: "10mb" }));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// ---------- Route imports ----------
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// ---------- Mount routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
