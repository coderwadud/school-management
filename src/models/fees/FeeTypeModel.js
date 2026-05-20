import mongoose from "mongoose";
const { Schema } = mongoose;

const feeTypeSchema = new Schema(
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
    code: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const FeeType = mongoose.model("FeeType", feeTypeSchema);
export default FeeType;
