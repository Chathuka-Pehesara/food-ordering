const express = require('express');
const multer = require('multer');
const path = require('path');
const FoodItem = require('../models/FoodItem');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Multer config for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        allowed.test(path.extname(file.originalname).toLowerCase())
            ? cb(null, true)
            : cb(new Error('Images only'));
    },
});

// for get foods
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};
        if (category && category !== 'All') filter.category = category;
        if (search) filter.name = { $regex: search, $options: 'i' };
        const foods = await FoodItem.find(filter).sort({ createdAt: -1 });
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// for get food by Id
router.get('/:id', async (req, res) => {
    try {
        const food = await FoodItem.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food item not found' });
        res.json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// for create foods  — admin only
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category, available } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';
        const food = await FoodItem.create({ name, description, price, category, image, available });
        res.status(201).json(food);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// for update foods by Id  — admin only
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
    try {
        const food = await FoodItem.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food item not found' });

        food.name = req.body.name ?? food.name;
        food.description = req.body.description ?? food.description;
        food.price = req.body.price ?? food.price;
        food.category = req.body.category ?? food.category;
        food.available = req.body.available ?? food.available;
        if (req.file) food.image = `/uploads/${req.file.filename}`;

        await food.save();
        res.json(food);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// for Delete foods by id  — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const food = await FoodItem.findByIdAndDelete(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food item not found' });
        res.json({ message: 'Food item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;