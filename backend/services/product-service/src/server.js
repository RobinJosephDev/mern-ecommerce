require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Serve static images
app.use("/images", express.static("uploads/images"));

// Routes
app.use("/products", productRoutes);

app.listen(PORT, () => console.log(`Product Service running on ${PORT}`));
