import Hostel from "../../models/hostel/HostelModel.js";

export const createHostel = async (req, res) => {
  try {
    const hostel = new Hostel(req.body);
    await hostel.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Hostel created successfully",
        data: hostel,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to create hostel",
      });
  }
};

export const getAllHostels = async (req, res) => {
  try {
    const { schoolId, type, status } = req.query;
    const query = {};
    if (schoolId) query.schoolId = schoolId;
    if (type) query.type = type;
    if (status !== undefined) query.status = status === "true";

    const hostels = await Hostel.find(query)
      .populate("schoolId", "name")
      .populate("warden", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: hostels });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch hostels",
      });
  }
};

export const getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate("schoolId", "name")
      .populate("warden", "name phone");

    if (!hostel)
      return res
        .status(404)
        .json({ success: false, message: "Hostel not found" });
    res.status(200).json({ success: true, data: hostel });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch hostel",
      });
  }
};

export const updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hostel)
      return res
        .status(404)
        .json({ success: false, message: "Hostel not found" });
    res
      .status(200)
      .json({
        success: true,
        message: "Hostel updated successfully",
        data: hostel,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to update hostel",
      });
  }
};

export const deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndDelete(req.params.id);
    if (!hostel)
      return res
        .status(404)
        .json({ success: false, message: "Hostel not found" });
    res
      .status(200)
      .json({ success: true, message: "Hostel deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to delete hostel",
      });
  }
};

export const toggleHostelStatus = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel)
      return res
        .status(404)
        .json({ success: false, message: "Hostel not found" });
    hostel.status = !hostel.status;
    await hostel.save();
    res
      .status(200)
      .json({
        success: true,
        message: `Hostel ${hostel.status ? "activated" : "deactivated"} successfully`,
        data: { status: hostel.status },
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to update hostel status",
      });
  }
};
