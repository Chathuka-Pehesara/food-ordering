const express = require('express');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

//create customers orders
router.post('/', protect, async (req, res) => {
    try {
        const { items, deliveryAddress, notes } = req.body;
        if (!items?.length) return res.status(400).json({ message: 'No items in order' });
        if (!deliveryAddress) return res.status(400).json({ message: 'Delivery address required' });

        const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        const order = await Order.create({
            customer: req.user._id,
            items,
            totalAmount,
            deliveryAddress,
            notes,
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// get customers own orders
router.get('/my', protect, async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('items.foodItem', 'name image')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get single order (owner or admin)
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email phone')
            .populate('items.foodItem', 'name image price');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        const isOwner = order.customer._id.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== 'admin')
            return res.status(403).json({ message: 'Not authorized' });

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// update status  — admin updates status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('customer', 'name email');

        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// get orders  — admin: all orders
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const { status, paymentStatus } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;

        const orders = await Order.find(filter)
            .populate('customer', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;