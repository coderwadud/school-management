import Book from "../../models/library/BookModel.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";

export const addBook = async (req, res) => {
  try {
    const bookData = req.body;

    if (req.files && req.files.bookCover) {
      const coverUrl = await uploadToCloudinary(req.files.bookCover[0].path);
      bookData.bookCover = coverUrl;
    }

    const book = new Book(bookData);
    await book.save();

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add book",
    });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category, status } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (status !== undefined) query.status = status === "true";

    const books = await Book.find(query)
      .populate("schoolId", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      data: books,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch books",
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "schoolId",
      "name",
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch book",
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const updateData = req.body;

    if (req.files && req.files.bookCover) {
      const coverUrl = await uploadToCloudinary(req.files.bookCover[0].path);
      updateData.bookCover = coverUrl;
    }

    const book = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update book",
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete book",
    });
  }
};

export const toggleBookStatus = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    book.status = !book.status;
    await book.save();

    res.status(200).json({
      success: true,
      message: `Book ${book.status ? "activated" : "deactivated"} successfully`,
      data: { status: book.status },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update book status",
    });
  }
};

export const getBookOptions = async (req, res) => {
  try {
    const books = await Book.find({ status: true, availableCopies: { $gt: 0 } })
      .select("_id title author isbn category")
      .sort({ title: 1 });

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch book options",
    });
  }
};
