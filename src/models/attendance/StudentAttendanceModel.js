import mongoose from "mongoose";
const { Schema } = mongoose;

const studentAttendanceSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
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
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Leave"],
      required: true,
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

// Compound index to prevent duplicate attendance for same student on same date
studentAttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

const StudentAttendance = mongoose.model(
  "StudentAttendance",
  studentAttendanceSchema,
);
export default StudentAttendance;
