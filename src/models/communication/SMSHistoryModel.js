import mongoose from "mongoose";

const smsHistorySchema = new mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ["Student", "Teacher", "Staff", "Parent", "All"],
      required: true,
    },
    recipients: [
      {
        recipientId: mongoose.Schema.Types.ObjectId,
        phone: String,
        name: String,
      },
    ],
    message: {
      type: String,
      required: true,
    },
    smsType: {
      type: String,
      enum: [
        "General",
        "Notice",
        "Fee Reminder",
        "Attendance",
        "Exam",
        "Result",
        "Custom",
      ],
      default: "General",
    },
    totalRecipients: {
      type: Number,
      default: 0,
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Sent", "Failed", "Partial"],
      default: "Pending",
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sentAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const SMSHistory = mongoose.model("SMSHistory", smsHistorySchema);

export default SMSHistory;
