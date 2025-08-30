const express = require('express');
const router = express.Router();
const authController = require("../controllers/Auth");
const { verifyToken } = require('../middleware/VerifyToken');

// Sign up (supports both /signup and /register)
router.post("/signup", authController.signup);
router.post("/register", authController.signup);

// Login
router.post('/login', authController.login);

// OTP & password flows
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Check authentication status
router.get("/check-auth", verifyToken, authController.checkAuth);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
