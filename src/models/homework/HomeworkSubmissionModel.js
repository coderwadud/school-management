import mongoose from "mongoose";
const { Schema } = mongoose;

const homeworkSubmissionSchema = new Schema(
  {
    homeworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Homework",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    attachments: [
      {
        type: String,
      },
    ],
    remarks: {
      type: String,
    },
    marks: {
      type: Number,
    },
    feedback: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Submitted", "Late", "Evaluated", "Not Submitted"],
      default: "Submitted",
    },
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true },
);

const HomeworkSubmission = mongoose.model(
  "HomeworkSubmission",
  homeworkSubmissionSchema,
);
export default HomeworkSubmission;
