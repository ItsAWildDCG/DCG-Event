import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, default: 'mock-gateway' },
    paymentStatus: { type: String, enum: ['paid', 'failed', 'pending'], default: 'paid' },
    paymentDate: { type: String, required: true }
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model('Payment', paymentSchema);
