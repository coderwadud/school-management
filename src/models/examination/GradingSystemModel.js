import mongoose from "mongoose";
const { Schema } = mongoose;

const gradingSystemSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    grades: [
      {
        grade: { type: String, required: true },
        gradePoint: { type: Number, required: true },
        minPercentage: { type: Number, required: true },
        maxPercentage: { type: Number, required: true },
        remarks: { type: String },
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const GradingSystem = mongoose.model("GradingSystem", gradingSystemSchema);
export default GradingSystem;
