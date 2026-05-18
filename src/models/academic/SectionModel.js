import { text } from "express";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
      description: {
      type: String,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Section = mongoose.model("Section", SectionSchema);
export default Section;
