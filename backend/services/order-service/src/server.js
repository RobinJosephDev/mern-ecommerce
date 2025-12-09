require("dotenv").config();
const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 4004;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/orders", orderRoutes);

app.listen(PORT, () => console.log(`Order Service running on ${PORT}`));
