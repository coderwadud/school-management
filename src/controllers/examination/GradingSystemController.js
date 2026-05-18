import GradingSystem from "../../models/examination/GradingSystemModel.js";

// Create grading system
export const createGradingSystem = async (req, res) => {
  try {
    const gradingSystem = new GradingSystem(req.body);
    await gradingSystem.save();

    res.status(201).json({
      success: true,
      message: "Grading system created successfully",
      data: gradingSystem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create grading system",
    });
  }
};

// Get all grading systems
export const getAllGradingSystems = async (req, res) => {
  try {
    const { schoolId, status } = req.query;
    const query = {};

    if (schoolId) query.schoolId = schoolId;
    if (status !== undefined) query.status = status === "true";

    const gradingSystems = await GradingSystem.find(query)
      .populate("schoolId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: gradingSystems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch grading systems",
    });
  }
};

// Get grading system by ID
export const getGradingSystemById = async (req, res) => {
  try {
    const gradingSystem = await GradingSystem.findById(req.params.id).populate(
      "schoolId",
      "name",
    );

    if (!gradingSystem) {
      return res.status(404).json({
        success: false,
        message: "Grading system not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gradingSystem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch grading system",
    });
  }
};

// Update grading system
export const updateGradingSystem = async (req, res) => {
  try {
    const gradingSystem = await GradingSystem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!gradingSystem) {
      return res.status(404).json({
        success: false,
        message: "Grading system not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Grading system updated successfully",
      data: gradingSystem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update grading system",
    });
  }
};

// Delete grading system
export const deleteGradingSystem = async (req, res) => {
  try {
    const gradingSystem = await GradingSystem.findByIdAndDelete(req.params.id);

    if (!gradingSystem) {
      return res.status(404).json({
        success: false,
        message: "Grading system not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Grading system deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete grading system",
    });
  }
};

// Toggle grading system status
export const toggleGradingSystemStatus = async (req, res) => {
  try {
    const gradingSystem = await GradingSystem.findById(req.params.id);

    if (!gradingSystem) {
      return res.status(404).json({
        success: false,
        message: "Grading system not found",
      });
    }

    gradingSystem.status = !gradingSystem.status;
    await gradingSystem.save();

    res.status(200).json({
      success: true,
      message: `Grading system ${gradingSystem.status ? "activated" : "deactivated"} successfully`,
      data: { status: gradingSystem.status },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update grading system status",
    });
  }
};
