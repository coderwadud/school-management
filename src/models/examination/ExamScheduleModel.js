import mongoose from "mongoose";
const { Schema } = mongoose;

const examScheduleSchema = new Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    passingMarks: {
      type: Number,
      required: true,
    },
    room: {
      type: String,
    },
    invigilators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
  },
  { timestamps: true },
);

const ExamSchedule = mongoose.model("ExamSchedule", examScheduleSchema);
export default ExamSchedule;
