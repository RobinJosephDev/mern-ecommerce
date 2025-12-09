const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenHelpers");

// ---------- Signup ----------
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const user = new User({
      name: username,
      email,
      password: hashedPassword,
      cartData: cart,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
    });

    res.json({ success: true, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- Login ----------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
    });

    res.json({ success: true, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- Refresh Token ----------
exports.refreshToken = async (req, res) => {
  try {
    // Accept token from cookie OR request body (useful for Postman / gateway)
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) return res.status(401).json({ error: "No refresh token" });

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ error: "Invalid refresh token" });

    try {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      user.refreshToken = null;
      await user.save();
      return res.status(403).json({ error: "Refresh token expired" });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    // Send the new refresh token in cookie AND response body
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "Strict",
    });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- Logout ----------
exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    res.clearCookie("refreshToken");
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
