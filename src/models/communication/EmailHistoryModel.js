import mongoose from "mongoose";

const emailHistorySchema = new mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ["Student", "Teacher", "Staff", "Parent", "All"],
      required: true,
    },
    recipients: [
      {
        recipientId: mongoose.Schema.Types.ObjectId,
        email: String,
        name: String,
      },
    ],
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
    emailType: {
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

const EmailHistory = mongoose.model("EmailHistory", emailHistorySchema);

export default EmailHistory;
