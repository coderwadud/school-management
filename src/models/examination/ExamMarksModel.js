import mongoose from "mongoose";
const { Schema } = mongoose;

const examMarksSchema = new Schema(
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
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
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
    passingMarks: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
    },
    gradePoint: {
      type: Number,
    },
    remarks: {
      type: String,
    },
    isAbsent: {
      type: Boolean,
      default: false,
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true },
);

// Compound index to prevent duplicate marks entry
examMarksSchema.index(
  { examId: 1, studentId: 1, subjectId: 1 },
  { unique: true },
);

const ExamMarks = mongoose.model("ExamMarks", examMarksSchema);
export default ExamMarks;
