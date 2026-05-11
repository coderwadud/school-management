import Class from "../models/ClassModel.js";
import Branch from "../models/BranchModel.js";
import Medium from "../models/MediumModel.js";
import School from "../models/SchoolModel.js";
export const createClass = async (req, res) => {
  try {
    const { name, schoolId, branchId, mediumId, status } = req.body;
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
    // Check if the medium exists
    const medium = await Medium.findById(mediumId);
    if (!medium) {
      return res.status(404).json({ message: "Medium not found" });
    }
    const newClass = new Class({
      name,
      schoolId,
        branchId,
        mediumId,
        status,
    });
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("schoolId", "name").populate("branchId", "name").populate("mediumId", "name");
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate("schoolId", "name").populate("branchId", "name").populate("mediumId", "name");
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(classData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { name, schoolId, branchId, mediumId, status } = req.body;
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
    // Check if the medium exists
    if (mediumId) {
        const medium = await Medium.findById(mediumId);
        if (!medium) {
        return res.status(404).json({ message: "Medium not found" });
      }
    }
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { name, schoolId, branchId, mediumId, status },
      { new: true }
    );
    if (!updatedClass) {
        return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteClass = async (req, res) => {
    try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const toggleClassStatus = async (req, res) => {
    try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    classData.status = !classData.status;
    const updatedClass = await classData.save();
    res.status(200).json(updatedClass);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const getClassesOptions = async (req, res) => {
  try {
    const classes = await Class.find({ status: true }).select("name _id");
    const options = classes.map((classData) => ({
      label: classData.name,
      value: classData._id,
    }));
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
