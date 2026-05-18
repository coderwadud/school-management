import HostelRoom from "../../models/hostel/HostelRoomModel.js";

export const createRoom = async (req, res) => {
  try {
    const room = new HostelRoom(req.body);
    await room.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Room created successfully",
        data: room,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to create room",
      });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const { hostelId, status } = req.query;
    const query = {};
    if (hostelId) query.hostelId = hostelId;
    if (status) query.status = status;

    const rooms = await HostelRoom.find(query)
      .populate("hostelId", "name type")
      .sort({ roomNumber: 1 });
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch rooms",
      });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await HostelRoom.findById(req.params.id).populate(
      "hostelId",
      "name type",
    );
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch room",
      });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await HostelRoom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    res
      .status(200)
      .json({
        success: true,
        message: "Room updated successfully",
        data: room,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to update room",
      });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await HostelRoom.findByIdAndDelete(req.params.id);
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    res
      .status(200)
      .json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to delete room",
      });
  }
};
