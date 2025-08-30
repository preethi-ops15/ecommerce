const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/VerifyToken');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Query = require('../models/Query');

// Get dashboard analytics
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    // Get current month and last month dates
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Fetch analytics data
    const [
      totalCustomers,
      totalProducts,
      totalOrders,
      currentMonthOrders,
      lastMonthOrders,
      totalRevenue,
      currentMonthRevenue,
      lastMonthRevenue,
      pendingQueries,
      averageRating
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isDeleted: { $ne: true } }),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: currentMonth } }),
      Order.countDocuments({ createdAt: { $gte: lastMonth, $lt: currentMonth } }),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: currentMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: lastMonth, $lt: currentMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Query.countDocuments({ status: 'pending' }),
      Product.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ])
    ]);

    // Calculate revenue
    const totalRevenueAmount = totalRevenue[0]?.total || 0;
    const currentMonthRevenueAmount = currentMonthRevenue[0]?.total || 0;
    const lastMonthRevenueAmount = lastMonthRevenue[0]?.total || 0;

    // Calculate growth percentages
    const orderGrowth = lastMonthOrders > 0 
      ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 
      : 0;
    
    const revenueGrowth = lastMonthRevenueAmount > 0 
      ? ((currentMonthRevenueAmount - lastMonthRevenueAmount) / lastMonthRevenueAmount) * 100 
      : 0;

    // Get top products by sales
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSales: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          title: '$product.title',
          sales: '$totalSales',
          revenue: '$totalRevenue'
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .select('totalAmount status user createdAt');

    // Get revenue data for last 6 months
    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalRevenue: totalRevenueAmount,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingQueries,
      averageRating: averageRating[0]?.avgRating || 0,
      monthlyGrowth: Math.round(revenueGrowth),
      orderGrowth: Math.round(orderGrowth),
      topProducts,
      recentOrders: recentOrders.map(order => ({
        _id: order._id,
        customer: order.user?.name || 'Unknown',
        amount: order.totalAmount,
        status: order.status
      })),
      revenueData
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

// Get revenue analytics
router.get('/revenue', verifyToken, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    
    let matchStage = {};
    if (period === 'month') {
      matchStage = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
    } else if (period === 'year') {
      matchStage = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
    }

    const revenueData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({ revenueData });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ message: 'Error fetching revenue data' });
  }
});

// Get customer analytics
router.get('/customers', verifyToken, async (req, res) => {
  try {
    const customerStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          newThisMonth: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', new Date(new Date().getFullYear(), new Date().getMonth(), 1)] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          totalSpent: 1,
          orderCount: 1
        }
      }
    ]);

    res.json({
      stats: customerStats[0] || { totalCustomers: 0, newThisMonth: 0 },
      topCustomers
    });
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    res.status(500).json({ message: 'Error fetching customer data' });
  }
});

module.exports = router;
