import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    avatar: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true },
);

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

export default AdminUser;
