import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, course: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
