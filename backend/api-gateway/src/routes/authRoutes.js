const express = require("express");
const router = express.Router();
const { forwardRequest } = require("../utils/serviceProxy");

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL;

// POST /api/auth/signup
router.post("/signup", (req, res) => {
  forwardRequest(req, res, `${AUTH_SERVICE}/signup`);
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  forwardRequest(req, res, `${AUTH_SERVICE}/login`);
});

// POST /api/auth/refresh
router.post("/refresh", (req, res) => {
  forwardRequest(req, res, `${AUTH_SERVICE}/refresh_token`);
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  forwardRequest(req, res, `${AUTH_SERVICE}/logout`);
});

module.exports = router;
