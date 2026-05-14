import mongoose from "mongoose";
const { Schema } = mongoose;

const sessionSchema = new Schema(
  {
    name: { type: String, required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
