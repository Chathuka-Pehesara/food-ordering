const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    payhereOrderId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'LKR' },
    statusCode: { type: String, default: '' },
    statusMessage: { type: String, default: '' },
    method: { type: String, default: '' },
    cardNo: { type: String, default: '' },
    paidAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);