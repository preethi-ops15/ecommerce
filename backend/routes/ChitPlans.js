const express = require('express');
const router = express.Router();
const chitPlanController = require("../controllers/ChitPlans");
const { verifyToken } = require('../middleware/VerifyToken');

// Create payment order for chit plan
router.post("/create-payment-order", verifyToken, chitPlanController.createPaymentOrder);

// Verify payment after successful payment
router.post("/verify-payment", verifyToken, chitPlanController.verifyPayment);

// Get user's chit plan details
router.get("/user-plan", verifyToken, chitPlanController.getUserPlan);

// Get redeemable amount for current user
router.get("/redeemable", verifyToken, chitPlanController.getRedeemable);

// Get all chit plans
router.get("/plans", chitPlanController.getPlans);

module.exports = router;
