import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantityAvailable: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

ticketSchema.index({ eventId: 1, type: 1 }, { unique: true });

export const TicketModel = mongoose.model('Ticket', ticketSchema);
