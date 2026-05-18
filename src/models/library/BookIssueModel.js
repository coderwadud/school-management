import mongoose from "mongoose";
const { Schema } = mongoose;

const bookIssueSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    fine: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Issued", "Returned", "Lost", "Overdue"],
      default: "Issued",
    },
    remarks: {
      type: String,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true },
);

const BookIssue = mongoose.model("BookIssue", bookIssueSchema);
export default BookIssue;
