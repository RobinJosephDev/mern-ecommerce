const Product = require("../models/Product");

// ---------- Add Product ----------
exports.addProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({ id, ...req.body });
    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
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
