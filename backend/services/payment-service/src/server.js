require("dotenv").config();
const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 4005;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/payments", paymentRoutes);

app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));
