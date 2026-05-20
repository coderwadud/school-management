import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const staffSchema = new Schema(
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
    designation: { type: String, required: true },
    department: { type: String },
    educationQualification: { type: String },
    joiningDate: { type: Date },
    dateOfBirth: { type: Date },
    address: { type: String },
    salary: { type: Number, default: 0 },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    religion: { type: String },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    emergencyContact: { type: String },
    status: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Hash password before saving
staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
staffSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
