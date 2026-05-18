import mongoose from "mongoose";

const onlineClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    classType: {
      type: String,
      enum: ["Live", "Recorded"],
      required: true,
    },
    platform: {
      type: String,
      enum: ["Zoom", "Google Meet", "Microsoft Teams", "Custom"],
    },
    meetingLink: {
      type: String,
    },
    meetingId: {
      type: String,
    },
    password: {
      type: String,
    },
    videoUrl: {
      type: String, // For recorded classes
    },
    scheduledDate: {
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
    duration: {
      type: Number, // in minutes
    },
    materials: [
      {
        title: String,
        fileUrl: String,
        fileType: String,
      },
    ],
    attendance: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        joinTime: Date,
        leaveTime: Date,
        duration: Number,
      },
    ],
    status: {
      type: String,
      enum: ["Scheduled", "Live", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  { timestamps: true },
);

const OnlineClass = mongoose.model("OnlineClass", onlineClassSchema);

export default OnlineClass;
