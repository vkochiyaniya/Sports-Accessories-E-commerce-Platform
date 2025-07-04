// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { requireAuth } = require("@clerk/express");
const { User, Order } = require("../models");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-razorpay-order", requireAuth(), async (req, res) => {
  try {
    const { amount, shippingAddress } = req.body;
    const amountNumber = Number(amount);
    const clerkUserId = req.auth.userId;

    if (!amountNumber || isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Find user in database
    const dbUser = await User.findOne({ where: { clerkId: clerkUserId } });
    if (!dbUser) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const options = {
      amount: amountNumber,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);
    
    // Create order in database with pending status
    const newOrder = await Order.create({
      userId: dbUser.id, // Using DB user ID, not clerkId
      totalAmount: amountNumber / 100, // Convert paise to rupees for DB
      paymentIntentId: razorpayOrder.id,
      status: "pending",
      shippingAddress: JSON.stringify(shippingAddress),
    });

    console.log("Order created successfully:", newOrder.id);

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      orderId: newOrder.id
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create Razorpay order", details: error.message });
  }
});

router.post("/verify-razorpay-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Verify payment status
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (payment.status !== "captured") {
      return res.status(400).json({ message: "Payment not captured" });
    }

    // Update order status
    const updatedOrder = await Order.update(
      { 
        status: "completed",
        paymentDate: new Date(),
        paymentId: razorpay_payment_id
      },
      {
        where: {
          paymentIntentId: razorpay_order_id,
        },
        returning: true
      }
    );

    console.log("Payment verified and order updated:", razorpay_order_id);
    res.status(200).json({ 
      message: "Payment verified successfully",
      orderId: updatedOrder[1]?.[0]?.id
    });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;