import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model('Category', categorySchema);
