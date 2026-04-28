import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  planId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED"],
    default: "PENDING"
  },
  bankId: String,
  accountNumber: String,
  transactionDate: Date,
  sepayTransactionId: String, // ID giao dịch từ hệ thống SePay
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
