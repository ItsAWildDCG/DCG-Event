import mongoose from 'mongoose';

const eventCategorySchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
  },
  { timestamps: true }
);

eventCategorySchema.index({ eventId: 1, categoryId: 1 }, { unique: true });

export const EventCategoryModel = mongoose.model('EventCategory', eventCategorySchema);