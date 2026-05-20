import mongoose from "mongoose";
const { Schema } = mongoose;

const examResultSchema = new Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    obtainedMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
    },
    gradePoint: {
      type: Number,
    },
    position: {
      type: Number,
    },
    result: {
      type: String,
      enum: ["Pass", "Fail"],
      required: true,
    },
    remarks: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Compound index to prevent duplicate result
examResultSchema.index({ examId: 1, studentId: 1 }, { unique: true });

const ExamResult = mongoose.model("ExamResult", examResultSchema);
export default ExamResult;
