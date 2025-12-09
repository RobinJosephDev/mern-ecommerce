// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const { DefaultDeserializer } = require("v8");

const app = express();
const port = process.env.PORT || 4000;

// ---------- Config ----------
const MONGO_URI = process.env.MONGO_URI;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

// ---------- Middlewares ----------
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

// ---------- MongoDB ----------
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ---------- Multer ----------
const storage = multer.diskStorage({
  destination: "uploads/images",
  filename: (req, file, cb) =>
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    ),
});
const upload = multer({ storage });

// ---------- Models ----------
const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  refreshToken: String,
  date: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  description: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  avilable: { type: Boolean, default: true },
});

// ---------- Token helpers ----------
const generateAccessToken = (user) =>
  jwt.sign({ user: { id: user.id } }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
const generateRefreshToken = (user) =>
  jwt.sign({ user: { id: user.id } }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

// ---------- Auth middleware ----------
const fetchuser = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ errors: "Please authenticate" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
  if (!token) return res.status(401).json({ errors: "Please authenticate" });

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ errors: "Invalid or expired token" });
  }
};

// ---------- Routes ----------

// Test
app.get("/", (req, res) => res.send("Express app running"));

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password || !username)
      return res.status(400).json({ success: false, error: "Missing fields" });

    const existing = await Users.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, error: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const user = new Users({
      name: username,
      email,
      password: hashed,
      cartData: cart,
    });
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, accessToken });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: "Missing fields" });

    const user = await Users.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, accessToken });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// Refresh token
app.post("/refresh_token", async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, error: "No refresh token" });

    const user = await Users.findOne({ refreshToken: token });
    if (!user)
      return res
        .status(403)
        .json({ success: false, error: "Invalid refresh token" });

    try {
      jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch {
      user.refreshToken = null;
      await user.save();
      return res
        .status(403)
        .json({ success: false, error: "Refresh token invalid/expired" });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, accessToken: newAccessToken });
  } catch {
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// Logout
app.post("/logout", async (req, res) => {

  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const user = await Users.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// ---------- Protected endpoints ----------
app.post("/upload", fetchuser, upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

app.post("/add_product", fetchuser, async (req, res) => {
  const products = await Product.find({});
  const id = products.lengh > 0 ? products[products.length - 1].id + 1 : 1;
  const product = new Product({ id, ...req.body });
  await product.save();
  res.json({ success: true, name: req.body.name });
});

app.post("/delete_product", fetchuser, async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, id: req.body.id });
});

app.post("/get_cart", fetchuser, async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

app.post("/add_to_cart", fetchuser, async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.updateOne({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added");
});

app.post("/remove_from_cart", fetchuser, async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await Users.updateOne({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed");
});

// ---------- Public endpoints ----------
app.use("/images", express.static("uploads/images"));

app.get("/all_products", async (req, res) => res.send(await Product.find({})));
app.get("/popular_in_women", async (req, res) =>
  res.send((await Product.find({ category: "women" })).splice(0, 4))
);
app.get("/new_collections", async (req, res) =>
  res.send((await Product.find({})).slice(-8))
);

// ---------- Start server ----------
app.listen(port, () => console.log(`Server running on port ${port}`));
