// auth-service/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 4001;

// ---------- Middlewares ----------
app.use(express.json({ limit: "5mb" })); // only ONCE
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Auth DB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ---------- Routes ----------
app.use("/auth", authRoutes);

// ---------- Start ----------
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
