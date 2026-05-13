import Section from "../../models/academic/SectionModel.js";
import School from "../../models/academic/SchoolModel.js";
import Branch from "../../models/academic/BranchModel.js";
import Class from "../../models/academic/ClassModel.js";
import Group from "../../models/academic/GroupModel.js";
import Medium from "../../models/academic/MediumModel.js";
import Teacher from "../../models/teacher/TeacherModel.js";

export const createSection = async (req, res) => {
  try {
    const { name, schoolId, branchId, groupId, mediumId, teacherId, classId } =
      req.body;
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
    // Check if the class exists
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }
    // Check if the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    // Check if the medium exists
    const medium = await Medium.findById(mediumId);
    if (!medium) {
      return res.status(404).json({ message: "Medium not found" });
    }
    // Check if the teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const newSection = new Section({
      name,
      schoolId,
      branchId,
      groupId,
      mediumId,
      teacherId,
      classId,
    });
    const savedSection = await newSection.save();
    res
      .status(201)
      .json({ data: savedSection, message: "Section created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSections = async (req, res) => {
  try {
    const sections = await Section.find()
      .populate("schoolId", "name")
      .populate("branchId", "name")
      .populate("classId", "name")
      .populate("groupId", "name")
      .populate("mediumId", "name")
      .populate("teacherId", "name");
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate("schoolId", "name")
      .populate("branchId", "name")
      .populate("classId", "name")
      .populate("groupId", "name")
      .populate("mediumId", "name")
      .populate("teacherId", "name");
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSection = async (req, res) => {
  try {
    const { name, schoolId, branchId, groupId, mediumId, teacherId, classId } =
      req.body;
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
    // Check if the class exists
    if (classId) {
      const classObj = await Class.findById(classId);
      if (!classObj) {
        return res.status(404).json({ message: "Class not found" });
      }
    }
    // Check if the group exists
    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
    }
    // Check if the medium exists
    if (mediumId) {
      const medium = await Medium.findById(mediumId);
      if (!medium) {
        return res.status(404).json({ message: "Medium not found" });
      }
    }
    // Check if the teacher exists
    if (teacherId) {
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
    }
    const updatedSection = await Section.findByIdAndUpdate(
      req.params.id,
      { name, schoolId, branchId, groupId, mediumId, teacherId, classId },
      { new: true },
    );
    if (!updatedSection) {
      return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json(updatedSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSection = async (req, res) => {
  try {
    const deletedSection = await Section.findByIdAndDelete(req.params.id);
    if (!deletedSection) {
      return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json({ message: "Section deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSectionsOptions = async (req, res) => {
  try {
    const sections = await Section.find({ status: true }).select("name _id");
    const options = sections.map((section) => ({
      label: section.name,
      value: section._id,
    }));
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleSectionStatus = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    section.status = !section.status;
    const updatedSection = await section.save();
    res.status(200).json(updatedSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
