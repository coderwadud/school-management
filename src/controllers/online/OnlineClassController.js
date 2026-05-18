import OnlineClass from "../../models/online/OnlineClassModel.js";

// Create online class
export const createOnlineClass = async (req, res) => {
  try {
    const onlineClass = new OnlineClass(req.body);
    await onlineClass.save();

    res.status(201).json({
      success: true,
      message: "Online class created successfully",
      data: onlineClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create online class",
    });
  }
};

// Get all online classes
export const getAllOnlineClasses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      classId,
      subjectId,
      teacherId,
      classType,
      status,
    } = req.query;

    const query = {};
    if (classId) query.classId = classId;
    if (subjectId) query.subjectId = subjectId;
    if (teacherId) query.teacherId = teacherId;
    if (classType) query.classType = classType;
    if (status) query.status = status;

    const classes = await OnlineClass.find(query)
      .populate("classId", "className")
      .populate("sectionId", "sectionName")
      .populate("subjectId", "subjectName")
      .populate("teacherId", "firstName lastName")
      .populate("sessionId", "sessionName")
      .sort({ scheduledDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await OnlineClass.countDocuments(query);

    res.status(200).json({
      success: true,
      data: classes,
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
      message: error.message || "Failed to fetch online classes",
    });
  }
};

// Get online class by ID
export const getOnlineClassById = async (req, res) => {
  try {
    const onlineClass = await OnlineClass.findById(req.params.id)
      .populate("classId", "className")
      .populate("sectionId", "sectionName")
      .populate("subjectId", "subjectName")
      .populate("teacherId", "firstName lastName")
      .populate("sessionId", "sessionName")
      .populate("attendance.studentId", "firstName lastName rollNumber");

    if (!onlineClass) {
      return res.status(404).json({
        success: false,
        message: "Online class not found",
      });
    }

    res.status(200).json({
      success: true,
      data: onlineClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch online class",
    });
  }
};

// Update online class
export const updateOnlineClass = async (req, res) => {
  try {
    const onlineClass = await OnlineClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!onlineClass) {
      return res.status(404).json({
        success: false,
        message: "Online class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Online class updated successfully",
      data: onlineClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update online class",
    });
  }
};

// Delete online class
export const deleteOnlineClass = async (req, res) => {
  try {
    const onlineClass = await OnlineClass.findByIdAndDelete(req.params.id);

    if (!onlineClass) {
      return res.status(404).json({
        success: false,
        message: "Online class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Online class deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete online class",
    });
  }
};

// Update class status
export const updateClassStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const onlineClass = await OnlineClass.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!onlineClass) {
      return res.status(404).json({
        success: false,
        message: "Online class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class status updated successfully",
      data: onlineClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update class status",
    });
  }
};

// Mark attendance
export const markAttendance = async (req, res) => {
  try {
    const { studentId, joinTime, leaveTime, duration } = req.body;

    const onlineClass = await OnlineClass.findById(req.params.id);

    if (!onlineClass) {
      return res.status(404).json({
        success: false,
        message: "Online class not found",
      });
    }

    onlineClass.attendance.push({
      studentId,
      joinTime,
      leaveTime,
      duration,
    });

    await onlineClass.save();

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      data: onlineClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to mark attendance",
    });
  }
};

// Get upcoming classes
export const getUpcomingClasses = async (req, res) => {
  try {
    const { teacherId, classId } = req.query;

    const query = {
      scheduledDate: { $gte: new Date() },
      status: { $in: ["Scheduled", "Live"] },
    };

    if (teacherId) query.teacherId = teacherId;
    if (classId) query.classId = classId;

    const classes = await OnlineClass.find(query)
      .populate("classId", "className")
      .populate("sectionId", "sectionName")
      .populate("subjectId", "subjectName")
      .populate("teacherId", "firstName lastName")
      .sort({ scheduledDate: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch upcoming classes",
    });
  }
};
