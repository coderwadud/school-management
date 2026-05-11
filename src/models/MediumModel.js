import mongoose from "mongoose";
const mediumSchema = new mongoose.Schema({
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
});

const Medium = mongoose.model("Medium", mediumSchema);
export default Medium;