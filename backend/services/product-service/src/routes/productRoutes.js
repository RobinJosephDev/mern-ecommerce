const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const productController = require("../controllers/productController");

// Admin routes
router.post("/add", productController.addProduct);
router.post("/delete", productController.deleteProduct);
router.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: true,
    image_url: `${process.env.PUBLIC_URL}/images/${req.file.filename}`,
  });
});

// Public routes
router.get("/all", productController.getAllProducts);
router.get("/popular_in_women", productController.getPopularInWomen);
router.get("/new_collections", productController.getNewCollections);

module.exports = router;
