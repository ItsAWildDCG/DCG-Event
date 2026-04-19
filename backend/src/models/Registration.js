import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    eventId: { type: mongoose.Schema.Types.Mixed, required: true },
    userId: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { strict: false, collection: 'Registration' }
);

registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const RegistrationModel = mongoose.model('Registration', registrationSchema, 'Registration');
