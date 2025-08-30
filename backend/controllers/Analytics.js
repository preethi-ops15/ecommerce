const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.getAnalytics = async (req, res) => {
  try {
    // Get total revenue
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get total customers
    const totalCustomers = await User.countDocuments();

    // Get top selling categories
    const topSellingCategories = await Order.aggregate([
      { $unwind: "$items" },
      { $lookup: { from: "products", localField: "items.productId", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $group: {
          _id: "$product.category",
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]);

    // Get recent metrics
    const recentMetrics = {
      conversionRate: await Order.countDocuments() / await User.countDocuments() * 100,
      averageOrderValue: totalRevenue.length > 0 ? totalRevenue[0].total / totalOrders : 0,
      customerRetention: await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }) / totalCustomers * 100
    };

    res.status(200).json({
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      topSellingCategories,
      recentMetrics
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};
