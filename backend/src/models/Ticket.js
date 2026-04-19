import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    eventId: { type: Number, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantityAvailable: { type: Number, required: true, min: 0 },
    quantity_available: { type: Number, default: null }
  },
  { strict: false, collection: 'Ticket' }
);

ticketSchema.index({ eventId: 1, type: 1 }, { unique: true });

export const TicketModel = mongoose.model('Ticket', ticketSchema, 'Ticket');
