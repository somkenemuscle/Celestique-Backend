import mongoose from "mongoose";
const { Schema } = mongoose;


const paymentSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who made the payment
  amount: { type: Number, required: true }, // Total amount paid
  paymentReference: { type: String, required: true, unique: true }, // Paystack reference
  transactionId: { type: String, required: true }, // Paystack transaction ID
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
});

export const Payment = mongoose.model('Payment', paymentSchema);
