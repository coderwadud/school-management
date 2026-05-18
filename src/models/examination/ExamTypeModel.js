import mongoose from "mongoose";
const { Schema } = mongoose;

const examTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const ExamType = mongoose.model("ExamType", examTypeSchema);
export default ExamType;
