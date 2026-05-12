import Medium from "../../models/academic/MediumModel.js";
import School from "../../models/academic/SchoolModel.js";
import Branch from "../../models/academic/BranchModel.js";
export const createMedium = async (req, res) => {
  try {
    const { name, schoolId, branchId, status } = req.body;
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
    const newMedium = new Medium({
      name,
      schoolId,
        branchId,
        status,
    });
    const savedMedium = await newMedium.save();
    res.status(201).json(savedMedium);
  }
    catch (error) { 
    res.status(500).json({ message: error.message });
  }
};

export const getMediums = async (req, res) => {
  try {
    const mediums = await Medium.find().populate("schoolId", "name").populate("branchId", "name");
    res.status(200).json(mediums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMediumById = async (req, res) => {
  try {
    const medium = await Medium.findById(req.params.id).populate("schoolId", "name").populate("branchId", "name");
    if (!medium) {
      return res.status(404).json({ message: "Medium not found" });
    }
    res.status(200).json(medium);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMedium = async (req, res) => {
  try {
    const { name, schoolId, branchId, status } = req.body;
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
    const updatedMedium = await Medium.findByIdAndUpdate(
      req.params.id,
      { name, schoolId, branchId, status },
      { new: true }
    );
    if (!updatedMedium) {
      return res.status(404).json({ message: "Medium not found" });
    }
    res.status(200).json(updatedMedium);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMedium = async (req, res) => {
    try {
    const deletedMedium = await Medium.findByIdAndDelete(req.params.id);
    if (!deletedMedium) {
      return res.status(404).json({ message: "Medium not found" });
    }
    res.status(200).json({ message: "Medium deleted successfully" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const toggleMediumStatus = async (req, res) => {
    try {
    const medium = await Medium.findById(req.params.id);
    if (!medium) {
      return res.status(404).json({ message: "Medium not found" });
    }
    medium.status = !medium.status;
    const updatedMedium = await medium.save();
    res.status(200).json(updatedMedium);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const getMediumsOptions = async (req, res) => {
    try {
    const mediums = await Medium.find({ status: true }).select("name _id");
    const options = mediums.map((medium) => ({
      label: medium.name,
      value: medium._id,
    }));
    res.status(200).json(options);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};