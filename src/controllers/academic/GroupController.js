import Group from "../../models/academic/GroupModel.js";
import School from "../../models/academic/SchoolModel.js";

export const createGroup = async (req, res) => {
  try {
    const schoolId = req.schoolId;
    const { name, description, status } = req.body;
    // Check if the school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    const newGroup = new Group({
      name,
      description,
      schoolId,
      status,
    });
    const savedGroup = await newGroup.save();
    res.status(201).json(
      {
        message: "Group created successfully",
        data: savedGroup,
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    const groupData = groups.map((group) => ({
      id: group._id,
      name: group.name,
      description: group.description,
      status: group.status,
    }));
    res.status(200).json(
      {
        message: "Groups retrieved successfully",
        data: groupData,
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const groupData = await Group.findById(req.params.id);
    const responseData = {
      id: groupData._id,
      name: groupData.name,
      description: groupData.description,
      status: groupData.status,
    };
    if (!groupData) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json({
      message: "Group retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const schoolId = req.schoolId;
    const { name, description, status } = req.body;
    // Check if the school exists
    if (schoolId) {
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
    }
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { name, description, schoolId, status },
      { new: true },
    );
    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json({
      message: "Group updated successfully",
      data: updatedGroup,
    });
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
  } catch (error) {
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
