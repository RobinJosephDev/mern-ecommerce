const User = require("../models/User");

// ---------- Get Cart ----------
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.cartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- Add to Cart ----------
exports.addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.cartData[itemId]) user.cartData[itemId] = 0;
    user.cartData[itemId] += 1;

    await user.save();
    res.json({ success: true, cart: user.cartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- Remove from Cart ----------
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.cartData[itemId] > 0) user.cartData[itemId] -= 1;

    await user.save();
    res.json({ success: true, cart: user.cartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
