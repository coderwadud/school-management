import mongoose from "mongoose";
const { Schema } = mongoose;

const groupSchema = new Schema({
    name: { type: String, required: true },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true,
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
    },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Group = mongoose.model("Group", groupSchema);
export default Group;