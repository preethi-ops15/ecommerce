const express = require('express');
const router = express.Router();
const orderController = require("../controllers/Order");
const { verifyToken } = require('../middleware/VerifyToken');

// Get all orders
router.get("/", verifyToken, orderController.getOrders);

// Create new order
router.post("/", verifyToken, orderController.createOrder);

// Create payment order for Razorpay
router.post("/create-payment-order", verifyToken, orderController.createPaymentOrder);

// Verify payment after successful payment
router.post("/verify-payment", verifyToken, orderController.verifyPayment);

// Get order by ID
router.get("/:id", verifyToken, orderController.getOrderById);

// Update order status
router.patch("/:id", verifyToken, orderController.updateOrder);

module.exports = router;