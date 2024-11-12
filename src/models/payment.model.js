import mongoose from {mongoose};
const { Schema } = mongoose;


const paymentSchema = new Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Reference to the order this payment is for
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who made the payment
    amount: { type: Number, required: true }, // Total amount paid
    paymentReference: { type: String, required: true, unique: true }, // Paystack reference
    transactionId: { type: String, required: true }, // Paystack transaction ID
    paymentStatus: { 
      type: String, 
      enum: ['Pending', 'Success', 'Failed'], 
      default: 'Pending' 
    },
    paymentMethod: { 
      type: String, 
      enum: ['Card', 'Bank', 'USSD'], 
      required: true 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Payment', paymentSchema);