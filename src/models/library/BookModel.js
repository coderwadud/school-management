import mongoose from "mongoose";
const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    edition: {
      type: String,
    },
    publishYear: {
      type: Number,
    },
    language: {
      type: String,
      default: "Bengali",
    },
    totalCopies: {
      type: Number,
      required: true,
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
    },
    rack: {
      type: String,
    },
    bookCover: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
