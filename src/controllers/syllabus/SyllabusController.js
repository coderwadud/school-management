import Syllabus from "../../models/syllabus/SyllabusModel.js";
import { v2 as cloudinary } from "cloudinary";

// Create syllabus
export const createSyllabus = async (req, res) => {
  try {
    const syllabusData = req.body;

    // Handle file upload if present
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "syllabus",
        resource_type: "auto",
      });
      syllabusData.syllabusFile = result.secure_url;
    }

    const syllabus = new Syllabus(syllabusData);
    await syllabus.save();

    res.status(201).json({
      success: true,
      message: "Syllabus created successfully",
      data: syllabus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create syllabus",
    });
  }
};

// Get all syllabi
export const getAllSyllabi = async (req, res) => {
  try {
    const { page = 1, limit = 10, classId, subjectId, sessionId } = req.query;

    const query = {};
    if (classId) query.classId = classId;
    if (subjectId) query.subjectId = subjectId;
    if (sessionId) query.sessionId = sessionId;

    const syllabi = await Syllabus.find(query)
      .populate("classId", "name")
      .populate("subjectId", "name code")
      .populate("sessionId", "name")
      .populate("uploadedBy", "personalInformation")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Syllabus.countDocuments(query);

    res.status(200).json({
      success: true,
      data: syllabi,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch syllabi",
    });
  }
};

// Get syllabus by ID
export const getSyllabusById = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id)
      .populate("classId", "name")
      .populate("subjectId", "name code")
      .populate("sessionId", "name")
      .populate("uploadedBy", "personalInformation");

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    res.status(200).json({
      success: true,
      data: syllabus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch syllabus",
    });
  }
};

// Get syllabus by class and subject
export const getSyllabusByClassAndSubject = async (req, res) => {
  try {
    const { classId, subjectId, sessionId } = req.query;

    const query = { status: true };
    if (classId) query.classId = classId;
    if (subjectId) query.subjectId = subjectId;
    if (sessionId) query.sessionId = sessionId;

    const syllabi = await Syllabus.find(query)
      .populate("classId", "name")
      .populate("subjectId", "name code")
      .populate("sessionId", "name")
      .populate("uploadedBy", "personalInformation")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: syllabi,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch syllabus",
    });
  }
};

// Update syllabus
export const updateSyllabus = async (req, res) => {
  try {
    const updateData = req.body;

    // Handle file upload if present
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "syllabus",
        resource_type: "auto",
      });
      updateData.syllabusFile = result.secure_url;
    }

    const syllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Syllabus updated successfully",
      data: syllabus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update syllabus",
    });
  }
};

// Delete syllabus
export const deleteSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findByIdAndDelete(req.params.id);

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Syllabus deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete syllabus",
    });
  }
};

// Toggle syllabus status
export const toggleSyllabusStatus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    syllabus.status = !syllabus.status;
    await syllabus.save();

    res.status(200).json({
      success: true,
      message: "Syllabus status updated successfully",
      data: syllabus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update syllabus status",
    });
  }
};
