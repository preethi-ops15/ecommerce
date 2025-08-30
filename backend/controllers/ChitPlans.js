const User = require("../models/User");
const ChitPlanOrder = require("../models/ChitPlanOrder");
const crypto = require('crypto');

// Initialize Razorpay only if keys are available
let razorpay = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    const Razorpay = require('razorpay');
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized successfully');
  } else {
    console.warn('⚠️ Razorpay keys not found. Payment functionality will be limited.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Razorpay:', error.message);
}

exports.createPaymentOrder = async (req, res) => {
  try {
    // Check if Razorpay is available
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: "Payment service not available. Please check Razorpay configuration."
      });
    }

    const { planId, planName, amount, startDate, userId } = req.body;

    // Validate input
    if (!planId || !planName || !amount || !startDate || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `chit_plan_${Date.now()}`,
      notes: {
        planId: planId.toString(),
        planName: planName,
        userId: userId
      }
    });

    // Create chit plan order in database
    const chitPlanOrder = new ChitPlanOrder({
      userId: userId,
      planId: planId,
      planName: planName,
      amount: amount,
      startDate: new Date(startDate),
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
      paymentMethod: 'razorpay'
    });

    await chitPlanOrder.save();

    res.status(200).json({
      success: true,
      message: "Payment order created successfully",
      order: {
        _id: chitPlanOrder._id,
        amount: chitPlanOrder.amount,
        razorpayOrderId: razorpayOrder.id
      }
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    
    if (error.message.includes('key_id') || error.message.includes('key_secret')) {
      return res.status(500).json({
        success: false,
        message: "Payment service configuration error. Please check Razorpay keys."
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to create payment order"
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    // Check if Razorpay is available
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: "Payment service not available. Please check Razorpay configuration."
      });
    }

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
      planId,
      userId
    } = req.body;

    // Validate input
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details"
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Update order status
    const order = await ChitPlanOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = 'completed';
    order.razorpayPaymentId = razorpay_payment_id;
    order.completedAt = new Date();
    await order.save();

    // Update user's chit plan status
    await User.findByIdAndUpdate(userId, {
      chitPlan: {
        planId: planId,
        planName: order.planName,
        startDate: order.startDate,
        status: 'active',
        subscribedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: order
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment"
    });
  }
};

exports.getUserPlan = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.chitPlan) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No active chit plan"
      });
    }

    res.status(200).json({
      success: true,
      data: user.chitPlan
    });

  } catch (error) {
    console.error('Get user plan error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get user plan"
    });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 1,
        name: 'Basic Plan',
        amount: 1000,
        duration: '12 months',
        features: [
          '₹1000 monthly investment',
          'Total Savings: ₹12,000',
          'Eligible for jewelry up to ₹15,000',
          'Priority customer support'
        ]
      },
      {
        id: 2,
        name: 'Standard Plan',
        amount: 2500,
        duration: '12 months',
        features: [
          '₹2,500 monthly investment',
          'Total Savings: ₹30,000',
          'Eligible for jewelry up to ₹40,000',
          'Priority customer support',
          '5% discount on making charges'
        ]
      },
      {
        id: 3,
        name: 'Premium Plan',
        amount: 5000,
        duration: '12 months',
        features: [
          '₹5,000 monthly investment',
          'Total Savings: ₹60,000',
          'Eligible for jewelry up to ₹80,000',
          '24/7 Priority support',
          '7% discount on making charges',
          'Free annual jewelry cleaning'
        ]
      }
    ];

    res.status(200).json({
      success: true,
      data: plans
    });

  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get plans"
    });
  }
};
