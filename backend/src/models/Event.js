import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    date: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvalStatus: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    venueIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }]
  },
  { timestamps: true }
);

export const EventModel = mongoose.model('Event', eventSchema);
