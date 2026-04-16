import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' }
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export const ReviewModel = mongoose.model('Review', reviewSchema);
