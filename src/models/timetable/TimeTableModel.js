import mongoose from "mongoose";

const timeTableSchema = new mongoose.Schema(
  {
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
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
    },
    dayOfWeek: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    periods: [
      {
        periodNumber: {
          type: Number,
          required: true,
        },
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
        },
        teacherId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        roomNumber: String,
        periodType: {
          type: String,
          enum: ["Class", "Break", "Lunch", "Assembly", "Sports", "Other"],
          default: "Class",
        },
        remarks: String,
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Index for faster queries
timeTableSchema.index({ classId: 1, sectionId: 1, dayOfWeek: 1 });

const TimeTable = mongoose.model("TimeTable", timeTableSchema);

export default TimeTable;
