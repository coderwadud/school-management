import mongoose from "mongoose";
const { Schema } = mongoose;

const vehicleSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ["Bus", "Van", "Car"],
      required: true,
    },
    model: {
      type: String,
    },
    capacity: {
      type: Number,
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportRoute",
    },
    registrationDate: {
      type: Date,
    },
    insuranceExpiryDate: {
      type: Date,
    },
    lastMaintenanceDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Maintenance", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
