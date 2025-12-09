const express = require("express");
const router = express.Router();
const { forwardRequest } = require("../utils/serviceProxy");

const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE;

// GET all products
router.get("/all", (req, res) => {
  forwardRequest(req, res, `${PRODUCT_SERVICE}/all_products`);
});

// GET new collections
router.get("/new", (req, res) => {
  forwardRequest(req, res, `${PRODUCT_SERVICE}/new_collections`);
});

// GET popular in women
router.get("/popular_women", (req, res) => {
  forwardRequest(req, res, `${PRODUCT_SERVICE}/popular_in_women`);
});

// POST add product (Admin)
router.post("/add", (req, res) => {
  forwardRequest(req, res, `${PRODUCT_SERVICE}/add_product`);
});

// DELETE product
router.post("/delete", (req, res) => {
  forwardRequest(req, res, `${PRODUCT_SERVICE}/delete_product`);
});

module.exports = router;
