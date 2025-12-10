require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 4002;
console.log("MONGO_URI =", process.env.MONGO_URI);

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// ---------- MongoDB ----------
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Serve static images
app.use("/images", express.static("uploads/images"));

// Routes
app.use("/products", productRoutes);

app.listen(PORT, () => console.log(`Product Service running on ${PORT}`));
