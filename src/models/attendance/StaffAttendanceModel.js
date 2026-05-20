import mongoose from "mongoose";
const { Schema } = mongoose;

const staffAttendanceSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Leave", "Half Day"],
      required: true,
    },
    checkInTime: {
      type: String,
    },
    checkOutTime: {
      type: String,
    },
    remarks: {
      type: String,
    },
    takenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true },
);

// Compound index to prevent duplicate attendance for same staff on same date
staffAttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

const StaffAttendance = mongoose.model(
  "StaffAttendance",
  staffAttendanceSchema,
);
export default StaffAttendance;
