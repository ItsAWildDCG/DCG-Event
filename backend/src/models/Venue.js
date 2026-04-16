import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, default: '' },
    city: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

export const VenueModel = mongoose.model('Venue', venueSchema);
