import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    description: {
      type: String,
    },
    chapters: [
      {
        chapterNumber: Number,
        chapterTitle: String,
        topics: [String],
        duration: String, // e.g., "2 weeks"
        learningOutcomes: [String],
      },
    ],
    syllabusFile: {
      type: String, // Cloudinary URL for PDF/DOC file
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    academicYear: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Index for faster queries
syllabusSchema.index({ classId: 1, subjectId: 1, sessionId: 1 });

const Syllabus = mongoose.model("Syllabus", syllabusSchema);

export default Syllabus;
