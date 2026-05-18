import FeeType from "../../models/fees/FeeTypeModel.js";

export const createFeeType = async (req, res) => {
  try {
    const feeType = new FeeType(req.body);
    await feeType.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Fee type created successfully",
        data: feeType,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to create fee type",
      });
  }
};

export const getAllFeeTypes = async (req, res) => {
  try {
    const { schoolId, status } = req.query;
    const query = {};
    if (schoolId) query.schoolId = schoolId;
    if (status !== undefined) query.status = status === "true";

    const feeTypes = await FeeType.find(query)
      .populate("schoolId", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: feeTypes });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch fee types",
      });
  }
};

export const getFeeTypeById = async (req, res) => {
  try {
    const feeType = await FeeType.findById(req.params.id).populate(
      "schoolId",
      "name",
    );
    if (!feeType)
      return res
        .status(404)
        .json({ success: false, message: "Fee type not found" });
    res.status(200).json({ success: true, data: feeType });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch fee type",
      });
  }
};

export const updateFeeType = async (req, res) => {
  try {
    const feeType = await FeeType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!feeType)
      return res
        .status(404)
        .json({ success: false, message: "Fee type not found" });
    res
      .status(200)
      .json({
        success: true,
        message: "Fee type updated successfully",
        data: feeType,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to update fee type",
      });
  }
};

export const deleteFeeType = async (req, res) => {
  try {
    const feeType = await FeeType.findByIdAndDelete(req.params.id);
    if (!feeType)
      return res
        .status(404)
        .json({ success: false, message: "Fee type not found" });
    res
      .status(200)
      .json({ success: true, message: "Fee type deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to delete fee type",
      });
  }
};

export const toggleFeeTypeStatus = async (req, res) => {
  try {
    const feeType = await FeeType.findById(req.params.id);
    if (!feeType)
      return res
        .status(404)
        .json({ success: false, message: "Fee type not found" });
    feeType.status = !feeType.status;
    await feeType.save();
    res
      .status(200)
      .json({
        success: true,
        message: `Fee type ${feeType.status ? "activated" : "deactivated"} successfully`,
        data: { status: feeType.status },
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to update fee type status",
      });
  }
};
