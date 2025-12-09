// api-gateway/utils/serviceProxy.js
const axios = require("axios");

exports.forwardRequest = async (req, res, targetUrl) => {
  try {
    const response = await axios({
      url: targetUrl,
      method: req.method,
      data: req.body,
      headers: {
        ...req.headers,
        host: undefined, // prevent Host header issues
      },
      withCredentials: true,
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Gateway Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: "Service unavailable",
      details: err.response?.data,
    });
  }
};
