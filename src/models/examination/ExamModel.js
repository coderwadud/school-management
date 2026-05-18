import mongoose from "mongoose";
const { Schema } = mongoose;

const examSchema = new Schema(
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
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    examType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamType",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  { timestamps: true },
);

const Exam = mongoose.model("Exam", examSchema);
export default Exam;
