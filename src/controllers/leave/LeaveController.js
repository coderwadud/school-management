import Leave from "../../models/leave/LeaveModel.js";

// Apply for leave
export const applyLeave = async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();

    res.status(201).json({
      success: true,
      message: "Leave application submitted successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to apply for leave",
    });
  }
};

// Get all leave applications
export const getAllLeaves = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      applicantType,
      startDate,
      endDate,
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (applicantType) query.applicantType = applicantType;
    if (startDate && endDate) {
      query.$or = [
        {
          startDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
      ];
    }

    const leaves = await Leave.find(query)
      .populate("applicantId", "personalInformation")
      .populate("approvedBy", "personalInformation")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Leave.countDocuments(query);

    res.status(200).json({
      success: true,
      data: leaves,
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
      message: error.message || "Failed to fetch leaves",
    });
  }
};

// Get leave by ID
export const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate("applicantId", "personalInformation")
      .populate("approvedBy", "personalInformation");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch leave",
    });
  }
};

// Get applicant's leave history
export const getApplicantLeaveHistory = async (req, res) => {
  try {
    const { applicantType, applicantId } = req.params;

    const leaves = await Leave.find({ applicantType, applicantId })
      .populate("approvedBy", "personalInformation")
      .sort({ createdAt: -1 });

    // Calculate statistics
    const approved = leaves.filter((l) => l.status === "Approved").length;
    const rejected = leaves.filter((l) => l.status === "Rejected").length;
    const pending = leaves.filter((l) => l.status === "Pending").length;
    const totalDaysApproved = leaves
      .filter((l) => l.status === "Approved")
      .reduce((sum, l) => sum + l.totalDays, 0);

    res.status(200).json({
      success: true,
      data: {
        leaves,
        statistics: {
          total: leaves.length,
          approved,
          rejected,
          pending,
          totalDaysApproved,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch leave history",
    });
  }
};

// Get pending leaves
export const getPendingLeaves = async (req, res) => {
  try {
    const { applicantType } = req.query;

    const query = { status: "Pending" };
    if (applicantType) query.applicantType = applicantType;

    const leaves = await Leave.find(query)
      .populate("applicantId", "personalInformation")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch pending leaves",
    });
  }
};

// Approve/Reject leave
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, approvedBy, rejectionReason, remarks } = req.body;

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Leave already processed",
      });
    }

    leave.status = status;
    leave.approvedBy = approvedBy;
    leave.approvedDate = new Date();
    if (rejectionReason) leave.rejectionReason = rejectionReason;
    if (remarks) leave.remarks = remarks;

    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave ${status.toLowerCase()} successfully`,
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update leave status",
    });
  }
};

// Cancel leave
export const cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    if (leave.status === "Approved" || leave.status === "Rejected") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel processed leave",
      });
    }

    leave.status = "Cancelled";
    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave cancelled successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel leave",
    });
  }
};

// Delete leave
export const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Leave deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete leave",
    });
  }
};

// Get leave balance (for employees)
export const getLeaveBalance = async (req, res) => {
  try {
    const { applicantType, applicantId } = req.params;
    const { year } = req.query;

    const currentYear = year || new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01`);
    const endDate = new Date(`${currentYear}-12-31`);

    const approvedLeaves = await Leave.find({
      applicantType,
      applicantId,
      status: "Approved",
      startDate: { $gte: startDate, $lte: endDate },
    });

    const totalDaysUsed = approvedLeaves.reduce(
      (sum, leave) => sum + leave.totalDays,
      0,
    );

    // Assuming yearly limits (can be configured)
    const yearlyLimits = {
      Student: 30,
      Teacher: 20,
      Staff: 20,
    };

    const totalAllowed = yearlyLimits[applicantType] || 20;
    const remaining = totalAllowed - totalDaysUsed;

    res.status(200).json({
      success: true,
      data: {
        year: currentYear,
        totalAllowed,
        totalUsed: totalDaysUsed,
        remaining: remaining > 0 ? remaining : 0,
        leaves: approvedLeaves,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch leave balance",
    });
  }
};
