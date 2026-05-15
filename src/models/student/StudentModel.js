import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new Schema({
    academicInformation: {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true,
        },
        shift: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shift",
            required: true,
        },
        medium: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medium",
            required: true,
        },
        studentClass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true,
        },

    },
    personalInformation: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, required: true },
        bloodGroup: { type: String },
        birthRegistrationNo: { type: String },
        religion: { type: String },
        nationality: { type: String },
        email: { type: String },
        nationality: { type: String },
        contactNumber: { type: String },
        studentPicture: { type: String },
        presentAddress: { type: String },
        permanentAddress: { type: String },
    },
    guardianInformation: {
        fatherName: { type: String, required: true },
        fatherNid: { type: String },
        motherName: { type: String, required: true },
        motherNid: { type: String },
        fatherProfession: { type: String },
        motherProfession: { type: String },
        fatherPicture: { type: String },
        motherPicture: { type: String },
        fatherContactNumber: { type: String },
        motherContactNumber: { type: String },
        guardianName: { type: String },
        guardianContactNumber: { type: String },
        guardianAddress: { type: String },
    },
    status: { type: Boolean, default: true },
} , { timestamps: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;