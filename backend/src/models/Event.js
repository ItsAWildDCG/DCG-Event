import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    date: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    venueIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }]
  },
  { timestamps: true }
);

export const EventModel = mongoose.model('Event', eventSchema);
