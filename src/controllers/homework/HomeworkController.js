import Homework from "../../models/homework/HomeworkModel.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";

export const createHomework = async (req, res) => {
  try {
    const homeworkData = req.body;
    homeworkData.assignedBy = req.user._id;

    if (req.files && req.files.attachments) {
      const attachments = [];
      for (const file of req.files.attachments) {
        const url = await uploadToCloudinary(file.path);
        attachments.push(url);
      }
      homeworkData.attachments = attachments;
    }

    const homework = new Homework(homeworkData);
    await homework.save();

    const populatedHomework = await Homework.findById(homework._id)
      .populate("classId", "name")
      .populate("sectionId", "name")
      .populate("subjectId", "name")
      .populate("assignedBy", "name");

    res.status(201).json({
      success: true,
      message: "Homework created successfully",
      data: populatedHomework,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create homework",
    });
  }
};

export const getAllHomework = async (req, res) => {
  try {
    const { classId, sectionId, subjectId, status } = req.query;

    const query = {};
    if (classId) query.classId = classId;
    if (sectionId) query.sectionId = sectionId;
    if (subjectId) query.subjectId = subjectId;
    if (status) query.status = status;

    const homework = await Homework.find(query)
      .populate("classId", "name")
      .populate("sectionId", "name")
      .populate("subjectId", "name")
      .populate("assignedBy", "name")
      .sort({ assignDate: -1 });

    res.status(200).json({
      success: true,
      data: homework,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch homework",
    });
  }
};

export const getHomeworkById = async (req, res) => {
  try {
    const homework = await Homework.findById(req.params.id)
      .populate("classId", "name")
      .populate("sectionId", "name")
      .populate("subjectId", "name")
      .populate("assignedBy", "name");

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    res.status(200).json({
      success: true,
      data: homework,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch homework",
    });
  }
};

export const updateHomework = async (req, res) => {
  try {
    const homework = await Homework.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Homework updated successfully",
      data: homework,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update homework",
    });
  }
};

export const deleteHomework = async (req, res) => {
  try {
    const homework = await Homework.findByIdAndDelete(req.params.id);

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Homework deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete homework",
    });
  }
};
