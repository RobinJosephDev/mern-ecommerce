const razorpay = require("../utils/razorpay");

// Create Order (Frontend uses this to start payment)
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const options = {
      amount: amount * 100, // Razorpay only accepts amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } 
  catch (err) {
    console.error("Razorpay Order Error:", err);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};


// Payment Verification (After frontend payment success)
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_payment_id)
      return res.status(400).json({ error: "Invalid payment" });

    // OPTIONAL: signature validation
    // const crypto = require("crypto");
    // const expectedSignature = crypto
    //   .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    //   .update(razorpay_order_id + "|" + razorpay_payment_id)
    //   .digest("hex");

    // if (expectedSignature !== razorpay_signature) {
    //   return res.status(400).json({ error: "Payment signature mismatch" });
    // }

    res.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  } 
  catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};
