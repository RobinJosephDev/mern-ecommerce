const Product = require("../models/Product");

// ---------- Add Product ----------
exports.addProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const product = new Product(req.body);
    const saved = await product.save();
    console.log("Saved product:", saved);
    res.json({ success: true, product: saved });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- Delete Product ----------
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- Get All Products ----------
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- Get Popular in Women ----------
exports.getPopularInWomen = async (req, res) => {
  try {
    const products = await Product.find({ category: "women" });
    res.json(products.slice(0, 4));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- Get New Collections ----------
exports.getNewCollections = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products.slice(-8));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
