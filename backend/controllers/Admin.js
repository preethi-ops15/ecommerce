const User = require("../models/User");
const Order = require("../models/Order");
const ChitPlanOrder = require("../models/ChitPlanOrder");
const Product = require("../models/Product");
const Query = require("../models/Query");

// Dashboard Analytics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ isAdmin: false });
    const totalOrders = await Order.countDocuments();
    const totalChitPlans = await ChitPlanOrder.countDocuments({ status: 'completed' });
    const totalProducts = await Product.countDocuments();
    
    // Revenue calculations
    const completedOrders = await Order.find({ paymentStatus: 'completed' });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Chit plan revenue
    const completedChitPlans = await ChitPlanOrder.find({ status: 'completed' });
    const chitPlanRevenue = completedChitPlans.reduce((sum, plan) => sum + plan.amount, 0);
    
    // Recent activities
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');
    const recentChitPlans = await ChitPlanOrder.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email');
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          totalOrders,
          totalChitPlans,
          totalProducts,
          totalRevenue,
          chitPlanRevenue
        },
        recentActivities: {
          orders: recentOrders,
          chitPlans: recentChitPlans
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};

// Customer Management
exports.getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { isAdmin: false };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const customers = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    // Get customer's orders and chit plans
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    const chitPlans = await ChitPlanOrder.find({ userId: req.params.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: {
        customer,
        orders,
        chitPlans
      }
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customer' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, isVerified, isBlocked } = req.body;
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (isBlocked !== undefined) updateData.isBlocked = isBlocked;
    
    const customer = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ success: false, message: 'Failed to update customer' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    // Delete associated orders and chit plans
    await Order.deleteMany({ user: req.params.id });
    await ChitPlanOrder.deleteMany({ userId: req.params.id });
    
    res.status(200).json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete customer' });
  }
};

// Chit Plan Management
exports.getAllChitPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status) query.status = status;
    
    const chitPlans = await ChitPlanOrder.find(query)
      .populate('userId', 'name email phone')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await ChitPlanOrder.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: chitPlans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get chit plans error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chit plans' });
  }
};

exports.getChitPlanById = async (req, res) => {
  try {
    const chitPlan = await ChitPlanOrder.findById(req.params.id)
      .populate('userId', 'name email phone');
    
    if (!chitPlan) {
      return res.status(404).json({ success: false, message: 'Chit plan not found' });
    }
    
    res.status(200).json({ success: true, data: chitPlan });
  } catch (error) {
    console.error('Get chit plan error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chit plan' });
  }
};

exports.updateChitPlan = async (req, res) => {
  try {
    const { status, startDate } = req.body;
    const updateData = {};
    
    if (status !== undefined) updateData.status = status;
    if (startDate !== undefined) updateData.startDate = startDate;
    
    const chitPlan = await ChitPlanOrder.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');
    
    if (!chitPlan) {
      return res.status(404).json({ success: false, message: 'Chit plan not found' });
    }
    
    res.status(200).json({ success: true, data: chitPlan });
  } catch (error) {
    console.error('Update chit plan error:', error);
    res.status(500).json({ success: false, message: 'Failed to update chit plan' });
  }
};

exports.deleteChitPlan = async (req, res) => {
  try {
    const chitPlan = await ChitPlanOrder.findByIdAndDelete(req.params.id);
    if (!chitPlan) {
      return res.status(404).json({ success: false, message: 'Chit plan not found' });
    }
    
    res.status(200).json({ success: true, message: 'Chit plan deleted successfully' });
  } catch (error) {
    console.error('Delete chit plan error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete chit plan' });
  }
};

exports.getChitPlanAnalytics = async (req, res) => {
  try {
    const totalPlans = await ChitPlanOrder.countDocuments();
    const activePlans = await ChitPlanOrder.countDocuments({ status: 'active' });
    const completedPlans = await ChitPlanOrder.countDocuments({ status: 'completed' });
    const pendingPlans = await ChitPlanOrder.countDocuments({ status: 'pending' });
    
    // Revenue by plan type
    const planRevenue = await ChitPlanOrder.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$planId', totalRevenue: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        overview: { totalPlans, activePlans, completedPlans, pendingPlans },
        revenue: planRevenue
      }
    });
  } catch (error) {
    console.error('Chit plan analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

// Product Management
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category = '', search = '' } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

exports.getProductAnalytics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        categories
      }
    });
  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

// Order Management
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', paymentStatus = '' } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData = {};
    
    if (status !== undefined) updateData.status = status;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
};

exports.getOrderAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const dispatchedOrders = await Order.countDocuments({ status: 'Dispatched' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });
    
    // Revenue by status
    const revenueByStatus = await Order.aggregate([
      { $group: { _id: '$status', totalRevenue: { $sum: '$total' }, count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        overview: { totalOrders, pendingOrders, dispatchedOrders, deliveredOrders, cancelledOrders },
        revenue: revenueByStatus
      }
    });
  } catch (error) {
    console.error('Order analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

// Query Management (Contact Form Queries)
exports.getAllQueries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status) query.status = status;
    
    const queries = await Query.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Query.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: queries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get queries error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch queries' });
  }
};

exports.getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }
    
    res.status(200).json({ success: true, data: query });
  } catch (error) {
    console.error('Get query error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch query' });
  }
};

exports.updateQuery = async (req, res) => {
  try {
    const { status, priority, response } = req.body;
    const updateData = {};
    
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (response !== undefined) {
      updateData.response = response;
      updateData.respondedAt = new Date();
    }
    
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }
    
    res.status(200).json({ success: true, data: query });
  } catch (error) {
    console.error('Update query error:', error);
    res.status(500).json({ success: false, message: 'Failed to update query' });
  }
};

exports.deleteQuery = async (req, res) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }
    
    res.status(200).json({ success: true, message: 'Query deleted successfully' });
  } catch (error) {
    console.error('Delete query error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete query' });
  }
};
