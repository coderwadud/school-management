import Group from "../models/GroupModel.js";
import School from "../models/SchoolModel.js";
import Branch from "../models/BranchModel.js";
export const createGroup = async (req, res) => {
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
    const newGroup = new Group({
      name,
      schoolId,
        branchId,
        status,
    });
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("schoolId", "name").populate("branchId", "name");
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const groupData = await Group.findById(req.params.id).populate("schoolId", "name").populate("branchId", "name");
    if (!groupData) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json(groupData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGroup = async (req, res) => {
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
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { name, schoolId, branchId, status }, 
        { new: true }
    );
    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.id);
    if (!deletedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleGroupStatus = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    group.status = !group.status;
    const updatedGroup = await group.save();
    res.status(200).json(updatedGroup);
  }
    catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupsOptions = async (req, res) => {
    try {
        const groups = await Group.find({ status: true }).select("name _id");
        const options = groups.map((group) => ({
          label: group.name,
          value: group._id,
        }));
        res.status(200).json(options);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};