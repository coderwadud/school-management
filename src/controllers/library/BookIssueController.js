import BookIssue from "../../models/library/BookIssueModel.js";
import Book from "../../models/library/BookModel.js";

export const issueBook = async (req, res) => {
  try {
    const issueData = req.body;
    issueData.issuedBy = req.user._id;

    // Check book availability
    const book = await Book.findById(issueData.bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Book not available" });
    }

    // Create issue record
    const bookIssue = new BookIssue(issueData);
    await bookIssue.save();

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    const populatedIssue = await BookIssue.findById(bookIssue._id)
      .populate("bookId", "title author isbn")
      .populate("studentId", "personalInformation")
      .populate("teacherId", "name")
      .populate("issuedBy", "name");

    res.status(201).json({
      success: true,
      message: "Book issued successfully",
      data: populatedIssue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to issue book",
    });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { fine, remarks } = req.body;

    const bookIssue = await BookIssue.findById(id);
    if (!bookIssue) {
      return res
        .status(404)
        .json({ success: false, message: "Book issue record not found" });
    }

    if (bookIssue.status === "Returned") {
      return res
        .status(400)
        .json({ success: false, message: "Book already returned" });
    }

    // Update issue record
    bookIssue.returnDate = new Date();
    bookIssue.status = "Returned";
    bookIssue.fine = fine || 0;
    if (remarks) bookIssue.remarks = remarks;
    await bookIssue.save();

    // Increase available copies
    const book = await Book.findById(bookIssue.bookId);
    book.availableCopies += 1;
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
      data: bookIssue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to return book",
    });
  }
};

export const getAllIssues = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, studentId, bookId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;
    if (bookId) query.bookId = bookId;

    const issues = await BookIssue.find(query)
      .populate("bookId", "title author isbn")
      .populate("studentId", "personalInformation")
      .populate("teacherId", "name")
      .populate("issuedBy", "name")
      .sort({ issueDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await BookIssue.countDocuments(query);

    res.status(200).json({
      success: true,
      data: issues,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch book issues",
    });
  }
};

export const getOverdueBooks = async (req, res) => {
  try {
    const today = new Date();
    const overdueIssues = await BookIssue.find({
      status: "Issued",
      dueDate: { $lt: today },
    })
      .populate("bookId", "title author")
      .populate("studentId", "personalInformation")
      .populate("teacherId", "name");

    res.status(200).json({
      success: true,
      data: overdueIssues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch overdue books",
    });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const issue = await BookIssue.findByIdAndDelete(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Book issue record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book issue record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete book issue record",
    });
  }
};
