import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'cancelled'], default: 'paid' },
    registrationDate: { type: String, required: true }
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model('Order', orderSchema);
