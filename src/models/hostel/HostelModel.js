import mongoose from "mongoose";
const { Schema } = mongoose;

const hostelSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Boys", "Girls", "Co-ed"],
      required: true,
    },
    address: {
      type: String,
    },
    totalRooms: {
      type: Number,
      required: true,
    },
    totalBeds: {
      type: Number,
      required: true,
    },
    warden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    facilities: [
      {
        type: String,
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Hostel = mongoose.model("Hostel", hostelSchema);
export default Hostel;
