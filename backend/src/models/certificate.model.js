import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    issuedAt: { type: Date, default: Date.now },
    certificateUrl: String,
  },
  { timestamps: true }
);

export const Certificate = mongoose.model('Certificate', certificateSchema);
