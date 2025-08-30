const express = require('express');
const router = express.Router();
const adminController = require("../controllers/Admin");
const { verifyToken, verifyAdmin } = require('../middleware/VerifyToken');

// Customer Management
router.get("/customers", verifyToken, verifyAdmin, adminController.getAllCustomers);
router.get("/customers/:id", verifyToken, verifyAdmin, adminController.getCustomerById);
router.patch("/customers/:id", verifyToken, verifyAdmin, adminController.updateCustomer);
router.delete("/customers/:id", verifyToken, verifyAdmin, adminController.deleteCustomer);

// Chit Plan Management
router.get("/chit-plans", verifyToken, verifyAdmin, adminController.getAllChitPlans);
router.get("/chit-plans/:id", verifyToken, verifyAdmin, adminController.getChitPlanById);
router.patch("/chit-plans/:id", verifyToken, verifyAdmin, adminController.updateChitPlan);
router.delete("/chit-plans/:id", verifyToken, verifyAdmin, adminController.deleteChitPlan);
router.get("/chit-plans/analytics", verifyToken, verifyAdmin, adminController.getChitPlanAnalytics);

// Product Management
router.get("/products", verifyToken, verifyAdmin, adminController.getAllProducts);
router.post("/products", verifyToken, verifyAdmin, adminController.createProduct);
router.get("/products/:id", verifyToken, verifyAdmin, adminController.getProductById);
router.patch("/products/:id", verifyToken, verifyAdmin, adminController.updateProduct);
router.delete("/products/:id", verifyToken, verifyAdmin, adminController.deleteProduct);
router.get("/products/analytics", verifyToken, verifyAdmin, adminController.getProductAnalytics);

// Order Management
router.get("/orders", verifyToken, verifyAdmin, adminController.getAllOrders);
router.get("/orders/:id", verifyToken, verifyAdmin, adminController.getOrderById);
router.patch("/orders/:id", verifyToken, verifyAdmin, adminController.updateOrder);
router.delete("/orders/:id", verifyToken, verifyAdmin, adminController.deleteOrder);
router.get("/orders/analytics", verifyToken, verifyAdmin, adminController.getOrderAnalytics);

// Query Management
router.get("/queries", verifyToken, verifyAdmin, adminController.getAllQueries);
router.get("/queries/:id", verifyToken, verifyAdmin, adminController.getQueryById);
router.patch("/queries/:id", verifyToken, verifyAdmin, adminController.updateQuery);
router.delete("/queries/:id", verifyToken, verifyAdmin, adminController.deleteQuery);

// Dashboard Analytics
router.get("/dashboard", verifyToken, verifyAdmin, adminController.getDashboardStats);

module.exports = router;
