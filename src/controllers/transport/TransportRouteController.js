import TransportRoute from "../../models/transport/TransportRouteModel.js";

export const createRoute = async (req, res) => {
  try {
    const route = new TransportRoute(req.body);
    await route.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Route created successfully",
        data: route,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to create route",
      });
  }
};

export const getAllRoutes = async (req, res) => {
  try {
    const { schoolId, status } = req.query;
    const query = {};
    if (schoolId) query.schoolId = schoolId;
    if (status !== undefined) query.status = status === "true";

    const routes = await TransportRoute.find(query)
      .populate("schoolId", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: routes });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch routes",
      });
  }
};

export const getRouteById = async (req, res) => {
  try {
    const route = await TransportRoute.findById(req.params.id).populate(
      "schoolId",
      "name",
    );
    if (!route)
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch route",
      });
  }
};

export const updateRoute = async (req, res) => {
  try {
    const route = await TransportRoute.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!route)
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });
    res
      .status(200)
      .json({
        success: true,
        message: "Route updated successfully",
        data: route,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to update route",
      });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const route = await TransportRoute.findByIdAndDelete(req.params.id);
    if (!route)
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });
    res
      .status(200)
      .json({ success: true, message: "Route deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to delete route",
      });
  }
};

export const toggleRouteStatus = async (req, res) => {
  try {
    const route = await TransportRoute.findById(req.params.id);
    if (!route)
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });
    route.status = !route.status;
    await route.save();
    res
      .status(200)
      .json({
        success: true,
        message: `Route ${route.status ? "activated" : "deactivated"} successfully`,
        data: { status: route.status },
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to update route status",
      });
  }
};
