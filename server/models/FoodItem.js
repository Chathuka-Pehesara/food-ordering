const mongoose = require('mongoose')
const foodItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: { type: Number },
    category: { type: String, enum: ['Pizza', 'Burger', 'Cake'] },
    image: { type: String },
    available: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('FoodItem', foodItemSchema);