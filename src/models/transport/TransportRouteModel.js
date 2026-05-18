import mongoose from "mongoose";
const { Schema } = mongoose;

const transportRouteSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    routeName: {
      type: String,
      required: true,
    },
    routeNumber: {
      type: String,
    },
    startLocation: {
      type: String,
      required: true,
    },
    endLocation: {
      type: String,
      required: true,
    },
    stops: [
      {
        stopName: String,
        arrivalTime: String,
      },
    ],
    fare: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const TransportRoute = mongoose.model("TransportRoute", transportRouteSchema);
export default TransportRoute;
