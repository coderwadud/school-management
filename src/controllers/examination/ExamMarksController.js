import ExamMarks from "../../models/examination/ExamMarksModel.js";
import ExamResult from "../../models/examination/ExamResultModel.js";
import GradingSystem from "../../models/examination/GradingSystemModel.js";

// Enter marks for a student
export const enterMarks = async (req, res) => {
  try {
    const marksData = req.body;
    marksData.enteredBy = req.user._id;

    // Calculate grade and grade point based on percentage
    const percentage = (marksData.obtainedMarks / marksData.totalMarks) * 100;

    // Fetch grading system (you can make schoolId dynamic)
    const gradingSystem = await GradingSystem.findOne({ status: true });
    if (gradingSystem) {
      const gradeInfo = gradingSystem.grades.find(
        (g) => percentage >= g.minPercentage && percentage <= g.maxPercentage,
      );
      if (gradeInfo) {
        marksData.grade = gradeInfo.grade;
        marksData.gradePoint = gradeInfo.gradePoint;
      }
    }

    // Check if marks already exist
    const existingMarks = await ExamMarks.findOne({
      examId: marksData.examId,
      studentId: marksData.studentId,
      subjectId: marksData.subjectId,
    });

    let marks;
    if (existingMarks) {
      // Update existing marks
      Object.assign(existingMarks, marksData);
      marks = await existingMarks.save();
    } else {
      // Create new marks entry
      marks = new ExamMarks(marksData);
      await marks.save();
    }

    res.status(201).json({
      success: true,
      message: "Marks entered successfully",
      data: marks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to enter marks",
    });
  }
};

// Enter marks for multiple students (bulk entry)
export const bulkEnterMarks = async (req, res) => {
  try {
    const { marks } = req.body;

    if (!marks || !Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Marks data is required",
      });
    }

    const savedMarks = [];
    const errors = [];

    // Fetch grading system once
    const gradingSystem = await GradingSystem.findOne({ status: true });

    for (const markData of marks) {
      try {
        markData.enteredBy = req.user._id;

        // Calculate grade and grade point
        if (!markData.isAbsent) {
          const percentage =
            (markData.obtainedMarks / markData.totalMarks) * 100;

          if (gradingSystem) {
            const gradeInfo = gradingSystem.grades.find(
              (g) =>
                percentage >= g.minPercentage && percentage <= g.maxPercentage,
            );
            if (gradeInfo) {
              markData.grade = gradeInfo.grade;
              markData.gradePoint = gradeInfo.gradePoint;
            }
          }
        }

        // Check if marks already exist
        const existingMarks = await ExamMarks.findOne({
          examId: markData.examId,
          studentId: markData.studentId,
          subjectId: markData.subjectId,
        });

        if (existingMarks) {
          Object.assign(existingMarks, markData);
          await existingMarks.save();
          savedMarks.push(existingMarks);
        } else {
          const newMarks = new ExamMarks(markData);
          await newMarks.save();
          savedMarks.push(newMarks);
        }
      } catch (error) {
        errors.push({
          studentId: markData.studentId,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Marks entered successfully",
      data: savedMarks,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to enter marks",
    });
  }
};

// Get marks for an exam and subject
export const getMarksByExamAndSubject = async (req, res) => {
  try {
    const { examId, subjectId } = req.query;

    if (!examId || !subjectId) {
      return res.status(400).json({
        success: false,
        message: "Exam ID and Subject ID are required",
      });
    }

    const marks = await ExamMarks.find({ examId, subjectId })
      .populate(
        "studentId",
        "personalInformation.firstName personalInformation.lastName",
      )
      .populate("subjectId", "name")
      .populate("enteredBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: marks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch marks",
    });
  }
};

// Get marks for a student in an exam
export const getStudentMarks = async (req, res) => {
  try {
    const { studentId, examId } = req.query;

    if (!studentId || !examId) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Exam ID are required",
      });
    }

    const marks = await ExamMarks.find({ studentId, examId })
      .populate("subjectId", "name code")
      .populate("examId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: marks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch student marks",
    });
  }
};

// Update marks
export const updateMarks = async (req, res) => {
  try {
    const updateData = req.body;

    // Recalculate grade if marks changed
    if (updateData.obtainedMarks || updateData.totalMarks) {
      const marks = await ExamMarks.findById(req.params.id);
      const totalMarks = updateData.totalMarks || marks.totalMarks;
      const obtainedMarks = updateData.obtainedMarks || marks.obtainedMarks;
      const percentage = (obtainedMarks / totalMarks) * 100;

      const gradingSystem = await GradingSystem.findOne({ status: true });
      if (gradingSystem) {
        const gradeInfo = gradingSystem.grades.find(
          (g) => percentage >= g.minPercentage && percentage <= g.maxPercentage,
        );
        if (gradeInfo) {
          updateData.grade = gradeInfo.grade;
          updateData.gradePoint = gradeInfo.gradePoint;
        }
      }
    }

    const marks = await ExamMarks.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!marks) {
      return res.status(404).json({
        success: false,
        message: "Marks not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Marks updated successfully",
      data: marks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update marks",
    });
  }
};

// Delete marks
export const deleteMarks = async (req, res) => {
  try {
    const marks = await ExamMarks.findByIdAndDelete(req.params.id);

    if (!marks) {
      return res.status(404).json({
        success: false,
        message: "Marks not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Marks deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete marks",
    });
  }
};
