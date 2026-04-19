import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    userId: { type: mongoose.Schema.Types.Mixed, required: true },
    eventId: { type: mongoose.Schema.Types.Mixed, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' }
  },
  { strict: false, collection: 'Review' }
);

reviewSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export const ReviewModel = mongoose.model('Review', reviewSchema, 'Review');
