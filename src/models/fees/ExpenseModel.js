import mongoose from "mongoose";
const { Schema } = mongoose;

const expenseSchema = new Schema(
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
        "Salary",
        "Maintenance",
        "Utilities",
        "Transport",
        "Stationary",
        "Books",
        "Equipment",
        "Event",
        "Marketing",
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
    invoiceNumber: {
      type: String,
    },
    description: {
      type: String,
    },
    attachments: [
      {
        type: String,
      },
    ],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true },
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
