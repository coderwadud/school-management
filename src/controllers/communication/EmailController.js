import EmailHistory from "../../models/communication/EmailHistoryModel.js";
import Student from "../../models/student/StudentModel.js";
import Teacher from "../../models/teacher/TeacherModel.js";
import Staff from "../../models/staff/StaffModel.js";

// Send Email
export const sendEmail = async (req, res) => {
  try {
    const {
      recipientType,
      recipientIds,
      subject,
      body,
      emailType,
      attachments,
    } = req.body;

    let recipients = [];

    // Fetch recipients based on type
    if (recipientType === "Student") {
      const students = await Student.find({ _id: { $in: recipientIds } });
      recipients = students.map((s) => ({
        recipientId: s._id,
        email: s.email,
        name: `${s.firstName} ${s.lastName}`,
      }));
    } else if (recipientType === "Teacher") {
      const teachers = await Teacher.find({ _id: { $in: recipientIds } });
      recipients = teachers.map((t) => ({
        recipientId: t._id,
        email: t.email,
        name: `${t.firstName} ${t.lastName}`,
      }));
    } else if (recipientType === "Staff") {
      const staff = await Staff.find({ _id: { $in: recipientIds } });
      recipients = staff.map((s) => ({
        recipientId: s._id,
        email: s.email,
        name: `${s.firstName} ${s.lastName}`,
      }));
    }

    const emailHistory = new EmailHistory({
      recipientType,
      recipients,
      subject,
      body,
      attachments,
      emailType,
      totalRecipients: recipients.length,
      sentBy: req.user?.id,
      status: "Sent", // In real app, this would be based on email service response
      sentCount: recipients.length,
      sentAt: new Date(),
    });

    await emailHistory.save();

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data: emailHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send email",
    });
  }
};

// Get email history
export const getEmailHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, recipientType, status } = req.query;

    const query = {};
    if (recipientType) query.recipientType = recipientType;
    if (status) query.status = status;

    const history = await EmailHistory.find(query)
      .populate("sentBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await EmailHistory.countDocuments(query);

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
      message: error.message || "Failed to fetch email history",
    });
  }
};

// Get email by ID
export const getEmailById = async (req, res) => {
  try {
    const email = await EmailHistory.findById(req.params.id).populate(
      "sentBy",
      "firstName lastName",
    );

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: email,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch email",
    });
  }
};

// Delete email history
export const deleteEmailHistory = async (req, res) => {
  try {
    const email = await EmailHistory.findByIdAndDelete(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email history deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete email history",
    });
  }
};
