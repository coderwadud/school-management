import SMSHistory from "../../models/communication/SMSHistoryModel.js";
import Student from "../../models/student/StudentModel.js";
import Teacher from "../../models/teacher/TeacherModel.js";
import Staff from "../../models/staff/StaffModel.js";

// Send SMS
export const sendSMS = async (req, res) => {
  try {
    const { recipientType, recipientIds, message, smsType } = req.body;

    let recipients = [];

    // Fetch recipients based on type
    if (recipientType === "Student") {
      const students = await Student.find({ _id: { $in: recipientIds } });
      recipients = students.map((s) => ({
        recipientId: s._id,
        phone: s.phone || s.fatherPhone,
        name: `${s.firstName} ${s.lastName}`,
      }));
    } else if (recipientType === "Teacher") {
      const teachers = await Teacher.find({ _id: { $in: recipientIds } });
      recipients = teachers.map((t) => ({
        recipientId: t._id,
        phone: t.phone,
        name: `${t.firstName} ${t.lastName}`,
      }));
    } else if (recipientType === "Staff") {
      const staff = await Staff.find({ _id: { $in: recipientIds } });
      recipients = staff.map((s) => ({
        recipientId: s._id,
        phone: s.phone,
        name: `${s.firstName} ${s.lastName}`,
      }));
    }

    const smsHistory = new SMSHistory({
      recipientType,
      recipients,
      message,
      smsType,
      totalRecipients: recipients.length,
      sentBy: req.user?.id,
      status: "Sent", // In real app, this would be based on SMS gateway response
      sentCount: recipients.length,
      sentAt: new Date(),
    });

    await smsHistory.save();

    res.status(200).json({
      success: true,
      message: "SMS sent successfully",
      data: smsHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send SMS",
    });
  }
};

// Get SMS history
export const getSMSHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, recipientType, status } = req.query;

    const query = {};
    if (recipientType) query.recipientType = recipientType;
    if (status) query.status = status;

    const history = await SMSHistory.find(query)
      .populate("sentBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SMSHistory.countDocuments(query);

    res.status(200).json({
      success: true,
      data: history,
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
      message: error.message || "Failed to fetch SMS history",
    });
  }
};

// Get SMS by ID
export const getSMSById = async (req, res) => {
  try {
    const sms = await SMSHistory.findById(req.params.id).populate(
      "sentBy",
      "firstName lastName",
    );

    if (!sms) {
      return res.status(404).json({
        success: false,
        message: "SMS record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch SMS",
    });
  }
};

// Delete SMS history
export const deleteSMSHistory = async (req, res) => {
  try {
    const sms = await SMSHistory.findByIdAndDelete(req.params.id);

    if (!sms) {
      return res.status(404).json({
        success: false,
        message: "SMS record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SMS history deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete SMS history",
    });
  }
};
