const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const FoodItem = require('../models/FoodItem');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// for dashboard
router.get('/dashboard', protect, adminOnly, async (req, res) => {
    try {
        const [totalOrders, totalCustomers, totalFoods, payments, recentOrders] = await Promise.all([
            Order.countDocuments(),
            User.countDocuments({ role: 'customer' }),
            FoodItem.countDocuments(),
            Payment.find({ statusCode: '2' }),
            Order.find().populate('customer', 'name email').sort({ createdAt: -1 }).limit(5),
        ]);

        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

        res.json({ totalOrders, totalCustomers, totalFoods, totalRevenue, recentOrders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// for customers
router.get('/customers', protect, adminOnly, async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' })
            .select('-password')
            .sort({ createdAt: -1 });

        // to Attach order count per customer
        const withOrders = await Promise.all(
            customers.map(async (c) => {
                const orderCount = await Order.countDocuments({ customer: c._id });
                return { ...c.toObject(), orderCount };
            })
        );

        res.json(withOrders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// for customers/:id/orders
router.get('/customers/:id/orders', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.params.id })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;