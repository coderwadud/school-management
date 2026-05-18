import mongoose from "mongoose";
const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
    },
    subjectCode: {
      type: String,
      unique: true,
    },
    practicalSubject: {
      type: Boolean,
      default: false,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
