const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex').toUpperCase();

// create initial payment
router.post('/initiate', protect, async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId).populate('customer', 'name email phone');

        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.customer._id.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Not authorized' });
        if (order.paymentStatus === 'paid')
            return res.status(400).json({ message: 'Order already paid' });

        const merchantId = process.env.PAYHERE_MERCHANT_ID;
        const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
        const amount = order.totalAmount.toFixed(2);
        const currency = 'LKR';

        const hashedSecret = md5(merchantSecret);
        const hash = md5(`${merchantId}${orderId}${amount}${currency}${hashedSecret}`);

        res.json({
            merchant_id: merchantId,
            return_url: `${process.env.CLIENT_URL}/order-confirmation/${orderId}`,
            cancel_url: `${process.env.CLIENT_URL}/checkout`,
            notify_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/payments/notify`,
            order_id: orderId,
            items: order.items.map(i => i.name).join(', '),
            currency,
            amount,
            first_name: order.customer.name.split(' ')[0],
            last_name: order.customer.name.split(' ').slice(1).join(' ') || 'N/A',
            email: order.customer.email,
            phone: order.customer.phone || '0000000000',
            address: order.deliveryAddress,
            city: 'Colombo',
            country: 'Sri Lanka',
            hash,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// create payment notify - PayHere server-to-server callback (no auth)
router.post('/notify', async (req, res) => {
    try {
        const {
            merchant_id, order_id, payhere_amount, payhere_currency,
            status_code, md5sig, payment_id, method, card_no, status_message,
        } = req.body;

        const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
        const hashedSecret = md5(merchantSecret);
        const localHash = md5(`${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`);

        if (localHash !== md5sig) {
            console.warn('PayHere hash mismatch');
            return res.sendStatus(400);
        }

        // status_code 2 = success
        if (status_code === '2') {
            await Order.findByIdAndUpdate(order_id, { paymentStatus: 'paid', status: 'confirmed' });
            await Payment.create({
                order: order_id,
                customer: (await Order.findById(order_id)).customer,
                payhereOrderId: payment_id || order_id,
                amount: parseFloat(payhere_amount),
                currency: payhere_currency,
                statusCode: status_code,
                statusMessage: status_message,
                method,
                cardNo: card_no || '',
                paidAt: new Date(),
            });
        }

        res.sendStatus(200);
    } catch (err) {
        console.error('Notify error:', err);
        res.sendStatus(500);
    }
});

// get all payments  — admin only
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('order', 'totalAmount status')
            .populate('customer', 'name email')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;