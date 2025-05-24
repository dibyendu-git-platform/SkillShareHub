import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
});

const lessonSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  resources: [String],
  quiz: [quizSchema],
});

const sectionSchema = new mongoose.Schema({
  title: String,
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    tags: [String],
    price: { type: Number, default: 0 },
    isSubscription: { type: Boolean, default: false },
    thumbnail: String,
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sections: [sectionSchema],
    enrolledCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Course = mongoose.model('Course', courseSchema);

