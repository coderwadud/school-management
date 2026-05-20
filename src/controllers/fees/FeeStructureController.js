import FeeStructure from "../../models/fees/FeeStructureModel.js";

export const createFeeStructure = async (req, res) => {
  try {
    const feeStructure = new FeeStructure(req.body);
    await feeStructure.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Fee structure created successfully",
        data: feeStructure,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to create fee structure",
      });
  }
};

export const getAllFeeStructures = async (req, res) => {
  try {
    const { schoolId, sessionId, classId, status } = req.query;
    const query = {};
    if (schoolId) query.schoolId = schoolId;
    if (sessionId) query.sessionId = sessionId;
    if (classId) query.classId = classId;
    if (status !== undefined) query.status = status === "true";

    const feeStructures = await FeeStructure.find(query)
      .populate("schoolId", "name")
      .populate("sessionId", "name")
      .populate("classId", "name")
      .populate("feeType", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: feeStructures });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch fee structures",
      });
  }
};

export const getFeeStructureById = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findById(req.params.id)
      .populate("schoolId", "name")
      .populate("sessionId", "name")
      .populate("classId", "name")
      .populate("feeType", "name");

    if (!feeStructure)
      return res
        .status(404)
        .json({ success: false, message: "Fee structure not found" });
    res.status(200).json({ success: true, data: feeStructure });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch fee structure",
      });
  }
};

export const updateFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!feeStructure)
      return res
        .status(404)
        .json({ success: false, message: "Fee structure not found" });
    res
      .status(200)
      .json({
        success: true,
        message: "Fee structure updated successfully",
        data: feeStructure,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to update fee structure",
      });
  }
};

export const deleteFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findByIdAndDelete(req.params.id);
    if (!feeStructure)
      return res
        .status(404)
        .json({ success: false, message: "Fee structure not found" });
    res
      .status(200)
      .json({ success: true, message: "Fee structure deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to delete fee structure",
      });
  }
};
