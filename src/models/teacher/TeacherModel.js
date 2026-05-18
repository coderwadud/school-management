import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const teacherSchema = new Schema(
  {
    name: { type: String, required: true },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    nid: { type: String, required: true, unique: true },
    bloodGroup: { type: String },
    image: { type: String },
    password: { type: String, required: true },
    designation: { type: String },
    educationQualification: { type: String },
    joiningDate: { type: Date },
    dateOfBirth: { type: Date },
    address: { type: String },
    salary: { type: Number, default: 0 },
    gender: { type: String },
    religion: { type: String },
    maritalStatus: { type: String },
    status: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
