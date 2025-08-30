const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
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
    console.log('✅ Razorpay initialized successfully for orders');
  } else {
    console.warn('⚠️ Razorpay keys not found. Order payment functionality will be limited.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Razorpay for orders:', error.message);
}

exports.create = async (req, res) => {
    try {
        const created = new Order(req.body)
        await created.save()
        res.status(201).json(created)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error creating an order, please trying again later'})
    }
}

exports.createOrder = async (req, res) => {
    try {
        const userId = req.body.userId || req.body.user;
        const items = req.body.items || req.body.item;
        const { address, paymentMode } = req.body;

        if (!userId || !items || !Array.isArray(items) || items.length === 0 || !address || !paymentMode) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Fetch user for membership
        const user = await User.findById(userId).lean();
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isMember = !!(user.chitPlan && user.chitPlan.status === 'active');

        const computePrice = (p, member) => {
            if (member) {
                if (p.memberPrice && p.memberPrice > 0) return p.memberPrice;
                if (p.salePrice && p.salePrice > 0) return p.salePrice;
                return p.price;
            } else {
                if (p.salePrice && p.salePrice > 0) return p.salePrice;
                if (p.userPrice && p.userPrice > 0) return p.userPrice;
                return p.price;
            }
        };

        const normalizedItems = [];
        let computedTotal = 0;
        for (const it of items) {
            const rawRef = it.product || it.productId || it._id;
            const productId = (rawRef && typeof rawRef === 'object' && rawRef._id) ? rawRef._id : rawRef;
            const quantity = Math.max(1, Number(it.quantity) || 1);
            const product = await Product.findById(productId).lean();
            if (!product) return res.status(400).json({ message: `Invalid product: ${productId}` });
            const unitPrice = computePrice(product, isMember);
            const lineTotal = unitPrice * quantity;
            computedTotal += lineTotal;
            normalizedItems.push({
                product: product._id,
                title: product.title,
                thumbnail: product.thumbnail,
                quantity,
                unitPrice,
                lineTotal
            });
        }

        const order = new Order({
            user: userId,
            item: normalizedItems,
            address,
            paymentMode,
            total: computedTotal,
            status: 'Pending',
            paymentStatus: paymentMode === 'COD' ? 'pending' : 'pending'
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error creating an order, please trying again later'});
    }
}

exports.createPaymentOrder = async (req, res) => {
    try {
        const { userId, items, address, paymentMode } = req.body;

        // Validate input (note: total will be computed server-side)
        if (!userId || !items || !Array.isArray(items) || items.length === 0 || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Fetch user to determine membership eligibility
        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isMember = !!(user.chitPlan && user.chitPlan.status === 'active');

        // Helper to compute effective price
        const computePrice = (p, member) => {
            if (member) {
                if (p.memberPrice && p.memberPrice > 0) return p.memberPrice;
                if (p.salePrice && p.salePrice > 0) return p.salePrice;
                return p.price;
            } else {
                if (p.salePrice && p.salePrice > 0) return p.salePrice;
                if (p.userPrice && p.userPrice > 0) return p.userPrice;
                return p.price;
            }
        };

        // Build normalized items with validated product info and computed prices
        const normalizedItems = [];
        let computedTotal = 0;
        for (const it of items) {
            // Support both {product: id|object, quantity} and {productId: id, quantity}
            const rawRef = it.product || it.productId || it._id;
            const productId = (rawRef && typeof rawRef === 'object' && rawRef._id) ? rawRef._id : rawRef;
            const quantity = Math.max(1, Number(it.quantity) || 1);
            const product = await Product.findById(productId).lean();
            if (!product) {
                return res.status(400).json({ success: false, message: `Invalid product: ${productId}` });
            }
            const unitPrice = computePrice(product, isMember);
            const lineTotal = unitPrice * quantity;
            computedTotal += lineTotal;
            normalizedItems.push({
                product: product._id,
                title: product.title,
                thumbnail: product.thumbnail,
                quantity,
                unitPrice,
                lineTotal
            });
        }

        // If Razorpay is configured, create a payment intent/order with computed total
        let razorpayOrder = null;
        if (razorpay) {
            razorpayOrder = await razorpay.orders.create({
                amount: Math.round(computedTotal * 100), // paise
                currency: 'INR',
                receipt: `order_${Date.now()}`,
                notes: {
                    userId: String(userId),
                    itemCount: normalizedItems.length,
                    paymentMode: paymentMode
                }
            });
        } else {
            console.warn('⚠️ Razorpay not configured. Proceeding without payment gateway order.');
        }

        // Create order in database with pending status
        const order = new Order({
            user: userId,
            item: normalizedItems,
            address: address,
            paymentMode: paymentMode,
            total: computedTotal,
            status: 'Pending',
            razorpayOrderId: razorpayOrder ? razorpayOrder.id : undefined,
            paymentStatus: razorpay ? 'pending' : 'pending'
        });

        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment order created successfully",
            order: {
                _id: order._id,
                amount: order.total,
                razorpayOrderId: razorpayOrder ? razorpayOrder.id : null,
            }
        });

    } catch (error) {
        console.error('Create payment order error:', error);
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
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = 'Pending';
        order.paymentStatus = 'completed';
        order.razorpayPaymentId = razorpay_payment_id;
        order.paymentCompletedAt = new Date();
        await order.save();

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

exports.getByUserId = async (req, res) => {
    try {
        const {id} = req.params
        const results = await Order.find({user:id})
        res.status(200).json(results)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error fetching orders, please trying again later'})
    }
}

exports.getOrders = async (req, res) => {
    try {
        let skip = 0
        let limit = 0

        if(req.query.page && req.query.limit){
            const pageSize = req.query.limit
            const page = req.query.page
            skip = pageSize*(page-1)
            limit = pageSize
        }

        const totalDocs = await Order.find({}).countDocuments().exec()
        const results = await Order.find({}).skip(skip).limit(limit).exec()

        res.header("X-Total-Count",totalDocs)
        res.status(200).json({
            success: true,
            orders: results,
            total: totalDocs
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error fetching orders, please try again later'})
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const {id} = req.params
        const order = await Order.findById(id)
        if (!order) {
            return res.status(404).json({message: 'Order not found'})
        }
        res.status(200).json(order)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error fetching order, please try again later'})
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const {id} = req.params
        const updated = await Order.findByIdAndUpdate(id, req.body, {new:true})
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error updating order, please try again later'})
    }
}

exports.updateById = async (req, res) => {
    try {
        const {id} = req.params
        const updated = await Order.findByIdAndUpdate(id, req.body, {new:true})
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error updating order, please try again later'})
    }
}
