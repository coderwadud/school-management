import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    applicantType: {
      type: String,
      required: true,
      enum: ["Student", "Teacher", "Staff"],
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "applicantType",
    },
    leaveType: {
      type: String,
      required: true,
      enum: [
        "Sick Leave",
        "Casual Leave",
        "Maternity Leave",
        "Paternity Leave",
        "Emergency Leave",
        "Other",
      ],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    attachment: {
      type: String, // Cloudinary URL for medical certificate or other documents
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher", // Assuming admin/principal is also a teacher
    },
    approvedDate: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true },
);

// Calculate total days before saving
leaveSchema.pre("save", function (next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    this.totalDays = diffDays;
  }
  next();
});

// Index for faster queries
leaveSchema.index({ applicantId: 1, applicantType: 1, status: 1 });
leaveSchema.index({ startDate: 1, endDate: 1 });

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
