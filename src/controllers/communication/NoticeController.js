import Notice from "../../models/communication/NoticeModel.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";

export const createNotice = async (req, res) => {
  try {
    const noticeData = req.body;
    noticeData.createdBy = req.user._id;

    // Upload attachments if provided
    if (req.files && req.files.attachments) {
      const attachments = [];
      for (const file of req.files.attachments) {
        const url = await uploadToCloudinary(file.path);
        attachments.push(url);
      }
      noticeData.attachments = attachments;
    }

    const notice = new Notice(noticeData);
    await notice.save();

    const populatedNotice = await Notice.findById(notice._id)
      .populate("schoolId", "name")
      .populate("classId", "name")
      .populate("createdBy", "name");

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: populatedNotice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create notice",
    });
  }
};

export const getAllNotices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      targetAudience,
      isPinned,
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (targetAudience) query.targetAudience = targetAudience;
    if (isPinned !== undefined) query.isPinned = isPinned === "true";

    // Check for expired notices and update status
    const today = new Date();
    await Notice.updateMany(
      { expiryDate: { $lt: today }, status: "Published" },
      { status: "Expired" },
    );

    const notices = await Notice.find(query)
      .populate("schoolId", "name")
      .populate("classId", "name")
      .populate("createdBy", "name")
      .sort({ isPinned: -1, publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Notice.countDocuments(query);

    res.status(200).json({
      success: true,
      data: notices,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch notices",
    });
  }
};

export const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate("schoolId", "name")
      .populate("classId", "name")
      .populate("createdBy", "name");

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch notice",
    });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const updateData = req.body;

    // Upload new attachments if provided
    if (req.files && req.files.attachments) {
      const attachments = [];
      for (const file of req.files.attachments) {
        const url = await uploadToCloudinary(file.path);
        attachments.push(url);
      }
      updateData.attachments = attachments;
    }

    const notice = await Notice.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update notice",
    });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete notice",
    });
  }
};

export const toggleNoticePin = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    notice.isPinned = !notice.isPinned;
    await notice.save();

    res.status(200).json({
      success: true,
      message: `Notice ${notice.isPinned ? "pinned" : "unpinned"} successfully`,
      data: { isPinned: notice.isPinned },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle notice pin",
    });
  }
};
