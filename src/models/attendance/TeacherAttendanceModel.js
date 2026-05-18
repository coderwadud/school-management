import mongoose from "mongoose";
const { Schema } = mongoose;

const teacherAttendanceSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
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

// Compound index to prevent duplicate attendance for same teacher on same date
teacherAttendanceSchema.index({ teacherId: 1, date: 1 }, { unique: true });

const TeacherAttendance = mongoose.model(
  "TeacherAttendance",
  teacherAttendanceSchema,
);
export default TeacherAttendance;
