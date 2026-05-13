import { text } from "express";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
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
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    mediumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medium",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Section = mongoose.model("Section", SectionSchema);
export default Section;
