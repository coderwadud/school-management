import Exam from "../../models/examination/ExamModel.js";
import ExamSchedule from "../../models/examination/ExamScheduleModel.js";

// Create exam
export const createExam = async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create exam",
    });
  }
};

// Get all exams
export const getAllExams = async (req, res) => {
  try {
    const { schoolId, sessionId, classId, examType, status } = req.query;
    const query = {};

    if (schoolId) query.schoolId = schoolId;
    if (sessionId) query.sessionId = sessionId;
    if (classId) query.classId = classId;
    if (examType) query.examType = examType;
    if (status) query.status = status;

    const exams = await Exam.find(query)
      .populate("schoolId", "name")
      .populate("sessionId", "name")
      .populate("examType", "name")
      .populate("classId", "name")
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch exams",
    });
  }
};

// Get exam by ID
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("schoolId", "name")
      .populate("sessionId", "name")
      .populate("examType", "name")
      .populate("classId", "name");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch exam",
    });
  }
};

// Update exam
export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update exam",
    });
  }
};

// Delete exam
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Also delete related schedules
    await ExamSchedule.deleteMany({ examId: req.params.id });

    res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete exam",
    });
  }
};

// Get exam schedule
export const getExamSchedule = async (req, res) => {
  try {
    const { examId } = req.params;

    const schedule = await ExamSchedule.find({ examId })
      .populate("subjectId", "name code")
      .populate("invigilators", "name")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch exam schedule",
    });
  }
};

// Create exam schedule
export const createExamSchedule = async (req, res) => {
  try {
    const schedule = new ExamSchedule(req.body);
    await schedule.save();

    res.status(201).json({
      success: true,
      message: "Exam schedule created successfully",
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create exam schedule",
    });
  }
};

// Update exam schedule
export const updateExamSchedule = async (req, res) => {
  try {
    const schedule = await ExamSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Exam schedule not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam schedule updated successfully",
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update exam schedule",
    });
  }
};

// Delete exam schedule
export const deleteExamSchedule = async (req, res) => {
  try {
    const schedule = await ExamSchedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Exam schedule not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam schedule deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete exam schedule",
    });
  }
};
