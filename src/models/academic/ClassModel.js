import mongoose from "mongoose";
const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    },
    schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
    },
    branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
    },
    status: {
    type: Boolean,
    default: true,
  },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Class = mongoose.model("Class", classSchema);
export default Class;