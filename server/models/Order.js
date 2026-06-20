const mongoose = require('mongoose')
const orderItemSchema = new mongoose.Schema({
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'cancelled', 'delivered'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
    paymentMethod: { type: String, default: 'payhere' },
    notes: { type: String, default: '' }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);