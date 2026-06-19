const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// for POST register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Name, email and password are required' });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered' });

        const user = await User.create({ name, email, password, phone, address });
        res.status(201).json({
            _id: user._id, name: user.name, email: user.email,
            role: user.role, token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// for POST login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ message: 'Invalid email or password' });

        res.json({
            _id: user._id, name: user.name, email: user.email,
            role: user.role, token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// for get current 
router.get('/me', protect, (req, res) => {
    const { _id, name, email, role, phone, address } = req.user;
    res.json({ _id, name, email, role, phone, address });
});

// for update profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        if (req.body.password) user.password = req.body.password;
        await user.save();
        res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;