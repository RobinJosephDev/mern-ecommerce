const User = require("../models/User");

// ---------- Get Cart ----------
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ CLEAN CART HERE
    const cleanCart = Object.fromEntries(
      [...user.cartData.entries()].filter(([_, qty]) => qty > 0)
    );

    res.json({
      success: true,
      cart: cleanCart,
    });
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

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const key = String(itemId);

    user.cartData.set(key, (user.cartData.get(key) || 0) + 1);

    await user.save();

    // ✅ CLEAN CART HERE
    const cleanCart = Object.fromEntries(
      [...user.cartData.entries()].filter(([_, qty]) => qty > 0)
    );

    res.json({
      success: true,
      cart: cleanCart,
    });
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

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const key = String(itemId);
    const currentQty = user.cartData.get(key);

    if (!currentQty) {
      return res.json({
        success: true,
        cart: Object.fromEntries(user.cartData),
      });
    }

    if (currentQty > 1) {
      user.cartData.set(key, currentQty - 1);
    } else {
      // ✅ remove item completely when qty hits 0
      user.cartData.delete(key);
    }

    await user.save();

    // ✅ return cleaned cart
    const cleanCart = Object.fromEntries(
      [...user.cartData.entries()].filter(([_, qty]) => qty > 0)
    );

    res.json({
      success: true,
      cart: cleanCart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
