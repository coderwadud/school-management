import Shift from "../../models/academic/ShiftModel.js";
import School from "../../models/academic/SchoolModel.js";

export const createShift = async (req, res) => {
  try {
    const schoolId = req.schoolId;
    const { name, startTime, endTime, status } = req.body;
    // Check if the school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    const newShift = new Shift({
      name,
      startTime,
      endTime,
      schoolId,
      status,
    });
    const savedShift = await newShift.save();
    res.status(201).json(savedShift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();
    const shiftData = shifts.map((shift) => ({
      id: shift._id.toString(),
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      status: shift.status,
    }));
    res.status(200).json({
      message: "Shifts retrieved successfully",
      data: shiftData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShiftById = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    res.status(200).json({
      message: "Shift retrieved successfully",
      data: {
        id: shift._id.toString(),
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        status: shift.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateShift = async (req, res) => {
  try {
    const schoolId = req.schoolId;
    const { name, startTime, endTime, status } = req.body;
    // Check if the school exists
    if (schoolId) {
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
    }
    const updatedShift = await Shift.findByIdAndUpdate(
      req.params.id,
      { name, startTime, endTime, schoolId, status },
      { new: true },
    );
    if (!updatedShift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    res.status(200).json({
      message: "Shift updated successfully",
      data: {
        id: updatedShift._id.toString(),
        name: updatedShift.name,
        startTime: updatedShift.startTime,
        endTime: updatedShift.endTime,
        status: updatedShift.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteShift = async (req, res) => {
  try {
    const deletedShift = await Shift.findByIdAndDelete(req.params.id);
    if (!deletedShift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    res.status(200).json({ message: "Shift deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleShiftStatus = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    shift.status = !shift.status;
    const updatedShift = await shift.save();
    res.status(200).json({
      message: "Shift status toggled successfully",
      data: {
        status: updatedShift.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShiftsOptions = async (req, res) => {
  try {
    const shifts = await Shift.find({ status: true }).select("name _id");
    const options = shifts.map((shift) => ({
      label: shift.name,
      value: shift._id.toString(),
    }));
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
