import mongoose from "mongoose";
const { Schema } = mongoose;

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    status: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Group = mongoose.model("Group", groupSchema);
export default Group;
