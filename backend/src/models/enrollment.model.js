import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: {
    percentage: { type: Number, default: 0 },
    lastAccessed: { type: Date },
  },
});

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
