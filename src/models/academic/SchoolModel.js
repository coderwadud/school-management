import mongoose from "mongoose";
const { Schema } = mongoose;

const schoolSchema = new Schema(
  {
    name: { type: String, required: true },
    schoolCode: { type: String, required: true, unique: true },
    logo: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    website: { type: String },
    address: {
      country: { type: String },
      city: { type: String },
      area: { type: String },
      postalCode: { type: String },
      fullAddress: { type: String },
    },
  },
  { timestamps: true },
);

const School = mongoose.model("School", schoolSchema);

export default School;
