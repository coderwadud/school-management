import mongoose from "mongoose";
const { Schema } = mongoose;
const branchSchema = new Schema({
    name: { type: String, required: true },
    branchCode: { type: String, required: true, unique: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    principalName: { type: String },
    address: {
        country: { type: String },
        city: { type: String },
        area: { type: String },
        postalCode: { type: String },
        fullAddress: { type: String },
    },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Branch = mongoose.model("Branch", branchSchema);
export default Branch;