import ExamType from "../../models/examination/ExamTypeModel.js";

// Create exam type
export const createExamType = async (req, res) => {
  try {
    const examType = new ExamType(req.body);
    await examType.save();

    res.status(201).json({
      success: true,
      message: "Exam type created successfully",
      data: examType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create exam type",
    });
  }
};

// Get all exam types
export const getAllExamTypes = async (req, res) => {
  try {
    const { schoolId, status } = req.query;
    const query = {};

    if (schoolId) query.schoolId = schoolId;
    if (status !== undefined) query.status = status === "true";

    const examTypes = await ExamType.find(query)
      .populate("schoolId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: examTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch exam types",
    });
  }
};

// Get exam type by ID
export const getExamTypeById = async (req, res) => {
  try {
    const examType = await ExamType.findById(req.params.id).populate(
      "schoolId",
      "name",
    );

    if (!examType) {
      return res.status(404).json({
        success: false,
        message: "Exam type not found",
      });
    }

    res.status(200).json({
      success: true,
      data: examType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch exam type",
    });
  }
};

// Update exam type
export const updateExamType = async (req, res) => {
  try {
    const examType = await ExamType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!examType) {
      return res.status(404).json({
        success: false,
        message: "Exam type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam type updated successfully",
      data: examType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update exam type",
    });
  }
};

// Delete exam type
export const deleteExamType = async (req, res) => {
  try {
    const examType = await ExamType.findByIdAndDelete(req.params.id);

    if (!examType) {
      return res.status(404).json({
        success: false,
        message: "Exam type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam type deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete exam type",
    });
  }
};

// Toggle exam type status
export const toggleExamTypeStatus = async (req, res) => {
  try {
    const examType = await ExamType.findById(req.params.id);

    if (!examType) {
      return res.status(404).json({
        success: false,
        message: "Exam type not found",
      });
    }

    examType.status = !examType.status;
    await examType.save();

    res.status(200).json({
      success: true,
      message: `Exam type ${examType.status ? "activated" : "deactivated"} successfully`,
      data: { status: examType.status },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update exam type status",
    });
  }
};
