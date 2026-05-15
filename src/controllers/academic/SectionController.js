import Section from "../../models/academic/SectionModel.js";
import School from "../../models/academic/SchoolModel.js";

export const createSection = async (req, res) => {
  try {
    const schoolId = req.schoolId;
    const { name, status } = req.body;
    // Check if the school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    const newSection = new Section({
      name,
      status,
      schoolId,
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
    const sections = await Section.find().populate("schoolId", "name");
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).populate(
      "schoolId",
      "name",
    );
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
    const schoolId = req.schoolId;
    const { name, status } = req.body;
    // Check if the school exists
    if (schoolId) {
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
    }
    const updatedSection = await Section.findByIdAndUpdate(
      req.params.id,
      { name, status, schoolId },
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
