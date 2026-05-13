import Shift from "../../models/academic/ShiftModel.js";
import School from "../../models/academic/SchoolModel.js";
import Branch from "../../models/academic/BranchModel.js";
export const createShift = async (req, res) => {
  try {
    const { name, startTime, endTime, schoolId, branchId, status } = req.body;
    // Check if the school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    // Check if the branch exists
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    const newShift = new Shift({
      name,
      startTime,
      endTime,
      schoolId,
      branchId,
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
    const shifts = await Shift.find()
      .populate("schoolId", "name")
      .populate("branchId", "name");
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShiftById = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id)
      .populate("schoolId", "name")
      .populate("branchId", "name");
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateShift = async (req, res) => {
  try {
    const { name, startTime, endTime, schoolId, branchId, status } = req.body;
    // Check if the school exists
    if (schoolId) {
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
    }
    // Check if the branch exists
    if (branchId) {
      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }
    }
    const updatedShift = await Shift.findByIdAndUpdate(
      req.params.id,
      { name, startTime, endTime, schoolId, branchId, status },
      { new: true },
    );
    if (!updatedShift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    res.status(200).json(updatedShift);
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
    res.status(200).json(updatedShift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShiftsOptions = async (req, res) => {
  try {
    const shifts = await Shift.find({ status: true }).select("name _id");
    const options = shifts.map((shift) => ({
      label: shift.name,
      value: shift._id,
    }));
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
