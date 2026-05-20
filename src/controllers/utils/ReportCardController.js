import ExamResult from "../../models/examination/ExamResultModel.js";
import ExamMarks from "../../models/examination/ExamMarksModel.js";
import Student from "../../models/student/StudentModel.js";
import Exam from "../../models/examination/ExamModel.js";
import GradingSystem from "../../models/examination/GradingSystemModel.js";

// Generate Report Card for a student
export const generateReportCard = async (req, res) => {
  try {
    const { studentId, examId } = req.query;

    // Get student info
    const student = await Student.findById(studentId)
      .populate("academicInformation.session", "name")
      .populate("academicInformation.studentClass", "name")
      .populate("academicInformation.section", "name")
      .populate("academicInformation.shift", "name");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Get exam info
    const exam = await Exam.findById(examId)
      .populate("examType", "name")
      .populate("sessionId", "name");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Get result
    const result = await ExamResult.findOne({ studentId, examId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found for this student",
      });
    }

    // Get subject-wise marks
    const marks = await ExamMarks.find({ studentId, examId }).populate(
      "subjectId",
      "name code",
    );

    // Get grading system
    const gradingSystem = await GradingSystem.findOne({ status: true });

    const reportCard = {
      studentInfo: {
        name: `${student.personalInformation.firstName} ${student.personalInformation.lastName}`,
        fatherName: student.guardianInformation.fatherName,
        motherName: student.guardianInformation.motherName,
        class: student.academicInformation.studentClass?.name,
        section: student.academicInformation.section?.name,
        shift: student.academicInformation.shift?.name,
        session: student.academicInformation.session?.name,
        photo: student.personalInformation.studentPicture,
      },
      examInfo: {
        examName: exam.name,
        examType: exam.examType?.name,
        session: exam.sessionId?.name,
      },
      marks: marks.map((mark) => ({
        subject: mark.subjectId?.name,
        subjectCode: mark.subjectId?.code,
        totalMarks: mark.totalMarks,
        obtainedMarks: mark.obtainedMarks,
        passingMarks: mark.passingMarks,
        grade: mark.grade,
        gradePoint: mark.gradePoint,
        isAbsent: mark.isAbsent,
      })),
      result: {
        totalMarks: result.totalMarks,
        obtainedMarks: result.obtainedMarks,
        percentage: result.percentage,
        grade: result.grade,
        gradePoint: result.gradePoint,
        position: result.position,
        result: result.result,
        remarks: result.remarks,
      },
      gradingSystem: gradingSystem?.grades || [],
      issueDate: new Date(),
    };

    res.status(200).json({
      success: true,
      message: "Report card generated successfully",
      data: reportCard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate report card",
    });
  }
};

// Generate Admit Card
export const generateAdmitCard = async (req, res) => {
  try {
    const { studentId, examId } = req.query;

    const student = await Student.findById(studentId)
      .populate("academicInformation.studentClass", "name")
      .populate("academicInformation.section", "name");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const exam = await Exam.findById(examId)
      .populate("examType", "name")
      .populate("classId", "name");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Get exam schedule
    const ExamSchedule = (
      await import("../../models/examination/ExamScheduleModel.js")
    ).default;
    const schedule = await ExamSchedule.find({ examId }).populate(
      "subjectId",
      "name code",
    );

    const admitCard = {
      studentInfo: {
        name: `${student.personalInformation.firstName} ${student.personalInformation.lastName}`,
        fatherName: student.guardianInformation.fatherName,
        class: student.academicInformation.studentClass?.name,
        section: student.academicInformation.section?.name,
        rollNumber: String(student._id).slice(-6).toUpperCase(),
        photo: student.personalInformation.studentPicture,
      },
      examInfo: {
        examName: exam.name,
        examType: exam.examType?.name,
        class: exam.classId?.name,
        startDate: exam.startDate,
        endDate: exam.endDate,
      },
      schedule: schedule.map((item) => ({
        subject: item.subjectId?.name,
        subjectCode: item.subjectId?.code,
        date: item.date,
        startTime: item.startTime,
        endTime: item.endTime,
        totalMarks: item.totalMarks,
        room: item.room,
      })),
      instructions: [
        "Students must bring this admit card to the examination hall",
        "Students must reach 15 minutes before the exam starts",
        "Mobile phones are strictly prohibited",
        "Students must bring their own stationery",
      ],
      issueDate: new Date(),
    };

    res.status(200).json({
      success: true,
      message: "Admit card generated successfully",
      data: admitCard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate admit card",
    });
  }
};

// Generate Tabulation Sheet (Class result summary)
export const generateTabulationSheet = async (req, res) => {
  try {
    const { examId, classId, sectionId } = req.query;

    const query = { examId, classId };
    if (sectionId) query.sectionId = sectionId;

    const results = await ExamResult.find(query)
      .populate("studentId", "personalInformation")
      .populate("classId", "name")
      .populate("sectionId", "name")
      .sort({ position: 1 });

    const exam = await Exam.findById(examId)
      .populate("examType", "name")
      .populate("sessionId", "name");

    const tabulationSheet = {
      examInfo: {
        examName: exam.name,
        examType: exam.examType?.name,
        session: exam.sessionId?.name,
        class: results[0]?.classId?.name,
        section: results[0]?.sectionId?.name,
      },
      results: results.map((result) => ({
        position: result.position,
        studentName: `${result.studentId.personalInformation.firstName} ${result.studentId.personalInformation.lastName}`,
        totalMarks: result.totalMarks,
        obtainedMarks: result.obtainedMarks,
        percentage: result.percentage,
        grade: result.grade,
        gradePoint: result.gradePoint,
        result: result.result,
      })),
      statistics: {
        totalStudents: results.length,
        passedStudents: results.filter((r) => r.result === "Pass").length,
        failedStudents: results.filter((r) => r.result === "Fail").length,
        passPercentage: (
          (results.filter((r) => r.result === "Pass").length / results.length) *
          100
        ).toFixed(2),
        highestMarks: Math.max(...results.map((r) => r.obtainedMarks)),
        lowestMarks: Math.min(...results.map((r) => r.obtainedMarks)),
        averageMarks: (
          results.reduce((sum, r) => sum + r.obtainedMarks, 0) / results.length
        ).toFixed(2),
      },
      generatedDate: new Date(),
    };

    res.status(200).json({
      success: true,
      message: "Tabulation sheet generated successfully",
      data: tabulationSheet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate tabulation sheet",
    });
  }
};
