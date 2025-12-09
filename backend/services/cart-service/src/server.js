require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const PORT = process.env.PORT || 4003;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/cart", cartRoutes);

app.listen(PORT, () => console.log(`Cart Service running on ${PORT}`));
