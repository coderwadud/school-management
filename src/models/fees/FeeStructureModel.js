import mongoose from "mongoose";
const { Schema } = mongoose;

const feeStructureSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
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
    dueDate: {
      type: Date,
    },
    frequency: {
      type: String,
      enum: ["Monthly", "Quarterly", "Half Yearly", "Yearly", "One Time"],
      default: "Yearly",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
export default FeeStructure;
