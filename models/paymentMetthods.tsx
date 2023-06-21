// mongoose schema for payment methods  
import mongoose from 'mongoose';
import User from './user';

const paymentMethodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    accountNumber: { type: String, required: true },
    type: { type:  String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User,
    },
}, {
    timestamps: true,
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

export default PaymentMethod;