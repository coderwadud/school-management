import mongoose from "mongoose";
const { Schema } = mongoose;

const incomeSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Fee Collection",
        "Donation",
        "Event",
        "Transport",
        "Hostel",
        "Library",
        "Other",
      ],
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Cheque", "Online"],
      required: true,
    },
    receiptNumber: {
      type: String,
    },
    description: {
      type: String,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true },
);

const Income = mongoose.model("Income", incomeSchema);
export default Income;
