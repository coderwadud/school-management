import HomeworkSubmission from "../../models/homework/HomeworkSubmissionModel.js";
import Homework from "../../models/homework/HomeworkModel.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";

// Submit homework
export const submitHomework = async (req, res) => {
  try {
    const submissionData = req.body;

    if (req.files && req.files.attachments) {
      const attachments = [];
      for (const file of req.files.attachments) {
        const url = await uploadToCloudinary(file.path);
        attachments.push(url);
      }
      submissionData.attachments = attachments;
    }

    // Check if homework exists
    const homework = await Homework.findById(submissionData.homeworkId);
    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    // Check if already submitted
    const existing = await HomeworkSubmission.findOne({
      homeworkId: submissionData.homeworkId,
      studentId: submissionData.studentId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Homework already submitted",
      });
    }

    // Check if late
    const dueDate = new Date(homework.dueDate);
    const submissionDate = new Date();
    if (submissionDate > dueDate) {
      submissionData.status = "Late";
    }

    const submission = new HomeworkSubmission(submissionData);
    await submission.save();

    const populatedSubmission = await HomeworkSubmission.findById(
      submission._id,
    )
      .populate("homeworkId", "title dueDate")
      .populate("studentId", "personalInformation");

    res.status(201).json({
      success: true,
      message: "Homework submitted successfully",
      data: populatedSubmission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit homework",
    });
  }
};

// Get all submissions for a homework
export const getHomeworkSubmissions = async (req, res) => {
  try {
    const { homeworkId } = req.params;

    const submissions = await HomeworkSubmission.find({ homeworkId })
      .populate("studentId", "personalInformation")
      .populate("evaluatedBy", "name")
      .sort({ submissionDate: -1 });

    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch submissions",
    });
  }
};

// Get student's homework submissions
export const getStudentSubmissions = async (req, res) => {
  try {
    const { studentId } = req.params;

    const submissions = await HomeworkSubmission.find({ studentId })
      .populate("homeworkId", "title dueDate subjectId")
      .populate("evaluatedBy", "name")
      .sort({ submissionDate: -1 });

    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch submissions",
    });
  }
};

// Evaluate homework
export const evaluateHomework = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks, feedback } = req.body;

    const submission = await HomeworkSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = "Evaluated";
    submission.evaluatedBy = req.user._id;
    await submission.save();

    res.status(200).json({
      success: true,
      message: "Homework evaluated successfully",
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to evaluate homework",
    });
  }
};

// Delete submission
export const deleteSubmission = async (req, res) => {
  try {
    const submission = await HomeworkSubmission.findByIdAndDelete(
      req.params.id,
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete submission",
    });
  }
};
