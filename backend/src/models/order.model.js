import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    amount: Number,
    currency: { type: String, default: 'inr' },
    paymentMethod: { type: String, enum: ['stripe', 'paypal'] },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: String,
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
