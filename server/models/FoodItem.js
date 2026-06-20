const mongoose = require('mongoose')
const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ['Pizza', 'Burger', 'Cake', 'Fried Rice', 'Kottu', 'Drinks', 'Other'], default: 'Other' },
    image: { type: String, default: '' },
    available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);