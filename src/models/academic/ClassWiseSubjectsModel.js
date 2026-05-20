import mongoose from "mongoose";
const { Schema } = mongoose;

const classWiseSubjectsSchema = new Schema({
    name: { type: String, required: true },
    subjectId: [{ type: Schema.Types.ObjectId, ref: "Subject", required: true }],
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    shiftId: { type: Schema.Types.ObjectId, ref: "Shift", required: true },
    mediumId: { type: Schema.Types.ObjectId, ref: "Medium", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    status: { type: Boolean, default: true },
}, { timestamps: true });

const ClassWiseSubjects = mongoose.model("ClassWiseSubjects", classWiseSubjectsSchema);

export default ClassWiseSubjects;
