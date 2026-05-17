import mongoose from "mongoose";
const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Class = mongoose.model("Class", classSchema);
export default Class;
