import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    permissions: [
      {
        module: {
          type: String,
          required: true,
        },
        actions: [
          {
            type: String,
            enum: ["create", "read", "update", "delete", "export", "import"],
          },
        ],
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
