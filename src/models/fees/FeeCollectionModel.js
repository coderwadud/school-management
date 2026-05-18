import mongoose from "mongoose";
const { Schema } = mongoose;

const feeCollectionSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    feeType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeType",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    fine: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Online", "Cheque", "Mobile Banking"],
      required: true,
    },
    transactionId: {
      type: String,
    },
    receiptNo: {
      type: String,
      required: true,
      unique: true,
    },
    month: {
      type: String,
    },
    year: {
      type: Number,
    },
    remarks: {
      type: String,
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    status: {
      type: String,
      enum: ["Paid", "Partial", "Due"],
      default: "Paid",
    },
  },
  { timestamps: true },
);

const FeeCollection = mongoose.model("FeeCollection", feeCollectionSchema);
export default FeeCollection;
