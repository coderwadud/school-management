import ExamResult from "../../models/examination/ExamResultModel.js";
import ExamMarks from "../../models/examination/ExamMarksModel.js";
import GradingSystem from "../../models/examination/GradingSystemModel.js";
import Student from "../../models/student/StudentModel.js";

// Generate result for a student
export const generateStudentResult = async (req, res) => {
  try {
    const { examId, studentId } = req.body;

    // Get all marks for this student in this exam
    const marks = await ExamMarks.find({ examId, studentId }).populate(
      "subjectId",
    );

    if (marks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No marks found for this student in this exam",
      });
    }

    // Calculate total and obtained marks
    let totalMarks = 0;
    let obtainedMarks = 0;
    let failedSubjects = [];

    marks.forEach((mark) => {
      totalMarks += mark.totalMarks;
      if (!mark.isAbsent) {
        obtainedMarks += mark.obtainedMarks;
        if (mark.obtainedMarks < mark.passingMarks) {
          failedSubjects.push(mark.subjectId.name);
        }
      } else {
        failedSubjects.push(mark.subjectId.name);
      }
    });

    const percentage = (obtainedMarks / totalMarks) * 100;

    // Get grade and grade point
    const gradingSystem = await GradingSystem.findOne({ status: true });
    let grade = "";
    let gradePoint = 0;

    if (gradingSystem) {
      const gradeInfo = gradingSystem.grades.find(
        (g) => percentage >= g.minPercentage && percentage <= g.maxPercentage,
      );
      if (gradeInfo) {
        grade = gradeInfo.grade;
        gradePoint = gradeInfo.gradePoint;
      }
    }

    // Determine pass/fail
    const result = failedSubjects.length === 0 ? "Pass" : "Fail";

    // Get student's class and section
    const student = await Student.findById(studentId);

    // Create or update result
    const existingResult = await ExamResult.findOne({ examId, studentId });

    let resultData = {
      examId,
      studentId,
      classId: student.academicInformation.studentClass,
      sectionId: student.academicInformation.section,
      totalMarks,
      obtainedMarks,
      percentage: percentage.toFixed(2),
      grade,
      gradePoint,
      result,
      remarks:
        failedSubjects.length > 0
          ? `Failed in: ${failedSubjects.join(", ")}`
          : "",
    };

    let savedResult;
    if (existingResult) {
      Object.assign(existingResult, resultData);
      savedResult = await existingResult.save();
    } else {
      savedResult = new ExamResult(resultData);
      await savedResult.save();
    }

    res.status(201).json({
      success: true,
      message: "Result generated successfully",
      data: savedResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate result",
    });
  }
};

// Generate results for all students in a class
export const generateClassResults = async (req, res) => {
  try {
    const { examId, classId, sectionId } = req.body;

    // Get all students in this class and section
    const students = await Student.find({
      "academicInformation.studentClass": classId,
      "academicInformation.section": sectionId,
      status: true,
    });

    const results = [];
    const errors = [];

    for (const student of students) {
      try {
        // Get all marks for this student
        const marks = await ExamMarks.find({ examId, studentId: student._id });

        if (marks.length === 0) {
          errors.push({
            studentId: student._id,
            error: "No marks found",
          });
          continue;
        }

        let totalMarks = 0;
        let obtainedMarks = 0;
        let failedSubjects = [];

        marks.forEach((mark) => {
          totalMarks += mark.totalMarks;
          if (!mark.isAbsent) {
            obtainedMarks += mark.obtainedMarks;
            if (mark.obtainedMarks < mark.passingMarks) {
              failedSubjects.push(mark.subjectId);
            }
          } else {
            failedSubjects.push(mark.subjectId);
          }
        });

        const percentage = (obtainedMarks / totalMarks) * 100;

        // Get grade
        const gradingSystem = await GradingSystem.findOne({ status: true });
        let grade = "";
        let gradePoint = 0;

        if (gradingSystem) {
          const gradeInfo = gradingSystem.grades.find(
            (g) =>
              percentage >= g.minPercentage && percentage <= g.maxPercentage,
          );
          if (gradeInfo) {
            grade = gradeInfo.grade;
            gradePoint = gradeInfo.gradePoint;
          }
        }

        const result = failedSubjects.length === 0 ? "Pass" : "Fail";

        // Create or update result
        const existingResult = await ExamResult.findOne({
          examId,
          studentId: student._id,
        });

        let resultData = {
          examId,
          studentId: student._id,
          classId,
          sectionId,
          totalMarks,
          obtainedMarks,
          percentage: percentage.toFixed(2),
          grade,
          gradePoint,
          result,
        };

        if (existingResult) {
          Object.assign(existingResult, resultData);
          await existingResult.save();
          results.push(existingResult);
        } else {
          const newResult = new ExamResult(resultData);
          await newResult.save();
          results.push(newResult);
        }
      } catch (error) {
        errors.push({
          studentId: student._id,
          error: error.message,
        });
      }
    }

    // Calculate positions
    if (results.length > 0) {
      const sortedResults = results.sort(
        (a, b) => b.obtainedMarks - a.obtainedMarks,
      );
      for (let i = 0; i < sortedResults.length; i++) {
        sortedResults[i].position = i + 1;
        await sortedResults[i].save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Results generated successfully",
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate results",
    });
  }
};

// Get result by student and exam
export const getStudentResult = async (req, res) => {
  try {
    const { studentId, examId } = req.query;

    const result = await ExamResult.findOne({ studentId, examId })
      .populate("examId", "name")
      .populate("studentId", "personalInformation")
      .populate("classId", "name")
      .populate("sectionId", "name");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    // Also get subject-wise marks
    const marks = await ExamMarks.find({ studentId, examId }).populate(
      "subjectId",
      "name code",
    );

    res.status(200).json({
      success: true,
      data: {
        result,
        marks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch result",
    });
  }
};

// Get class results (merit list)
export const getClassResults = async (req, res) => {
  try {
    const { examId, classId, sectionId } = req.query;

    const query = { examId, classId };
    if (sectionId) query.sectionId = sectionId;

    const results = await ExamResult.find(query)
      .populate("studentId", "personalInformation")
      .populate("classId", "name")
      .populate("sectionId", "name")
      .sort({ position: 1 });

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch class results",
    });
  }
};

// Publish results
export const publishResults = async (req, res) => {
  try {
    const { examId, classId, sectionId } = req.body;

    const query = { examId, classId };
    if (sectionId) query.sectionId = sectionId;

    await ExamResult.updateMany(query, { isPublished: true });

    res.status(200).json({
      success: true,
      message: "Results published successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to publish results",
    });
  }
};

// Get fail list
export const getFailList = async (req, res) => {
  try {
    const { examId, classId, sectionId } = req.query;

    const query = { examId, classId, result: "Fail" };
    if (sectionId) query.sectionId = sectionId;

    const failedStudents = await ExamResult.find(query)
      .populate("studentId", "personalInformation")
      .populate("classId", "name")
      .populate("sectionId", "name");

    res.status(200).json({
      success: true,
      data: failedStudents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch fail list",
    });
  }
};
