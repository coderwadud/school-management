import mongoose from "mongoose";
const { Schema } = mongoose;

const classWiseSubjectsSchema = new Schema({
    name: { type: String, required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    subjectId: [{ type: Schema.Types.ObjectId, ref: "Subject", required: true }],
    status: { type: Boolean, default: true },
}, { timestamps: true });

const ClassWiseSubjects = mongoose.model("ClassWiseSubjects", classWiseSubjectsSchema);

export default ClassWiseSubjects;
