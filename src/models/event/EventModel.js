import mongoose from "mongoose";
const { Schema } = mongoose;

const eventSchema = new Schema(
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
    },
    eventType: {
      type: String,
      enum: ["Holiday", "Exam", "Sports", "Cultural", "Meeting", "Other"],
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
    location: {
      type: String,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    color: {
      type: String,
      default: "#3788d8",
    },
    status: {
      type: String,
      enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  { timestamps: true },
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
