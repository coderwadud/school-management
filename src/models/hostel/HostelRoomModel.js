import mongoose from "mongoose";
const { Schema } = mongoose;

const hostelRoomSchema = new Schema(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Dormitory"],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    occupiedBeds: {
      type: Number,
      default: 0,
    },
    fee: {
      type: Number,
      required: true,
    },
    facilities: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["Available", "Full", "Maintenance"],
      default: "Available",
    },
  },
  { timestamps: true },
);

const HostelRoom = mongoose.model("HostelRoom", hostelRoomSchema);
export default HostelRoom;
