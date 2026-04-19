import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    registrationId: { type: mongoose.Schema.Types.Mixed, default: null },
    orderId: { type: mongoose.Schema.Types.Mixed, required: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, default: null },
    payment_method: { type: String, required: true, default: 'mock-gateway' },
    paymentStatus: { type: String, enum: ['paid', 'failed', 'pending'], default: null },
    payment_status: { type: String, required: true, default: 'paid' },
    paymentDate: { type: String, default: null },
    payment_date: { type: String, required: true }
  },
  { strict: false, collection: 'Payment' }
);

export const PaymentModel = mongoose.model('Payment', paymentSchema, 'Payment');
