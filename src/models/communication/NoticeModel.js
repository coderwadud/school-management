import mongoose from "mongoose";
const { Schema } = mongoose;

const noticeSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "General",
        "Exam",
        "Holiday",
        "Event",
        "Urgent",
        "Academic",
        "Administrative",
      ],
      default: "General",
    },
    targetAudience: {
      type: String,
      enum: [
        "All",
        "Students",
        "Teachers",
        "Staff",
        "Parents",
        "Specific Class",
      ],
      default: "All",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    publishDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    attachments: [
      {
        type: String,
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Expired"],
      default: "Published",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true },
);

const Notice = mongoose.model("Notice", noticeSchema);
export default Notice;
