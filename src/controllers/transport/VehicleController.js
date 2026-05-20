import Vehicle from "../../models/transport/VehicleModel.js";

export const createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Vehicle created successfully",
        data: vehicle,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to create vehicle",
      });
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    const { schoolId, status } = req.query;
    const query = {};
    if (schoolId) query.schoolId = schoolId;
    if (status) query.status = status;

    const vehicles = await Vehicle.find(query)
      .populate("schoolId", "name")
      .populate("driverId", "name phone")
      .populate("routeId", "routeName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch vehicles",
      });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate("schoolId", "name")
      .populate("driverId", "name phone")
      .populate("routeId", "routeName");

    if (!vehicle)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch vehicle",
      });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vehicle)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    res
      .status(200)
      .json({
        success: true,
        message: "Vehicle updated successfully",
        data: vehicle,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to update vehicle",
      });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    res
      .status(200)
      .json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to delete vehicle",
      });
  }
};
