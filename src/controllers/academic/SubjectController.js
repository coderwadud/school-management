import School from "../../models/academic/SchoolModel.js";
import Subject from "../../models/academic/SubjectModel.js";

export const createSubject = async (req, res) => {
  try {
    const schoolId = req.schoolId;
    const { name, shortName, subjectCode, practicalSubject, status } = req.body;
    // Check if the school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    const newSubject = new Subject({
      name,
      shortName,
      subjectCode,
      practicalSubject,
      schoolId,
      status,
    });
    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("schoolId", "name");
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate(
      "schoolId",
      "name",
    );
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const schoolId = req.schoolId;
    const { name, shortName, subjectCode, practicalSubject, status } = req.body;
    // Check if the school exists
    if (schoolId) {
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
    }
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, shortName, subjectCode, practicalSubject, schoolId, status },
      { new: true },
    );
    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleSubjectStatus = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    subject.status = !subject.status;
    await subject.save();
    res.status(200).json({
      message: "Subject status toggled successfully",
      status: subject.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjectsOptions = async (req, res) => {
  try {
    const subjects = await Subject.find({ status: true }).select("name _id");
    const options = subjects.map((subject) => ({
      label: subject.name,
      value: subject._id,
    }));
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
