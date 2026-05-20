import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateType: {
      type: String,
      required: true,
      enum: [
        "Character Certificate",
        "Bonafide Certificate",
        "Study Certificate",
        "Migration Certificate",
        "Course Completion Certificate",
        "Participation Certificate",
        "Achievement Certificate",
        "Other",
      ],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    purpose: {
      type: String,
    },
    content: {
      type: String, // Main content/body of the certificate
    },
    academicYear: {
      type: String,
    },
    remarks: {
      type: String,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    verificationCode: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Cancelled", "Expired"],
      default: "Active",
    },
  },
  { timestamps: true },
);

// Generate certificate number before saving
certificateSchema.pre("save", async function (next) {
  if (!this.certificateNumber) {
    const count = await mongoose.model("Certificate").countDocuments();
    const year = new Date().getFullYear();
    this.certificateNumber = `CERT${year}${String(count + 1).padStart(5, "0")}`;
  }

  // Generate verification code
  if (!this.verificationCode) {
    this.verificationCode = Math.random()
      .toString(36)
      .substring(2, 12)
      .toUpperCase();
  }

  next();
});

// Index for faster queries
certificateSchema.index({ studentId: 1, certificateType: 1 });
certificateSchema.index({ certificateNumber: 1 });

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
