import StaffAttendance from "../../models/attendance/StaffAttendanceModel.js";
import Staff from "../../models/staff/StaffModel.js";

// Take attendance for multiple staff
export const takeAttendance = async (req, res) => {
  try {
    const { attendance, date, schoolId } = req.body;

    if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Attendance data is required",
      });
    }

    const attendanceRecords = [];
    const errors = [];

    for (const record of attendance) {
      try {
        const existingAttendance = await StaffAttendance.findOne({
          staffId: record.staffId,
          date: new Date(date),
        });

        if (existingAttendance) {
          existingAttendance.status = record.status;
          existingAttendance.checkInTime = record.checkInTime || "";
          existingAttendance.checkOutTime = record.checkOutTime || "";
          existingAttendance.remarks = record.remarks || "";
          existingAttendance.takenBy = req.user._id;
          await existingAttendance.save();
          attendanceRecords.push(existingAttendance);
        } else {
          const newAttendance = new StaffAttendance({
            schoolId,
            staffId: record.staffId,
            date: new Date(date),
            status: record.status,
            checkInTime: record.checkInTime || "",
            checkOutTime: record.checkOutTime || "",
            remarks: record.remarks || "",
            takenBy: req.user._id,
          });
          await newAttendance.save();
          attendanceRecords.push(newAttendance);
        }
      } catch (error) {
        errors.push({
          staffId: record.staffId,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Staff attendance recorded successfully",
      data: attendanceRecords,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to record attendance",
    });
  }
};

// Get attendance by date
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date, schoolId } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const query = { date: new Date(date) };
    if (schoolId) query.schoolId = schoolId;

    const attendance = await StaffAttendance.find(query)
      .populate("staffId", "name designation email phone")
      .populate("takenBy", "name")
      .sort({ createdAt: -1 });

    const allStaffQuery = schoolId
      ? { schoolId, status: true }
      : { status: true };
    const allStaff = await Staff.find(allStaffQuery).select(
      "name designation email phone",
    );

    const attendanceMap = attendance.reduce((acc, record) => {
      if (record.staffId) {
        acc[record.staffId._id.toString()] = record;
      }
      return acc;
    }, {});

    const result = allStaff.map((staff) => {
      const attendanceRecord = attendanceMap[staff._id.toString()];
      return {
        staffId: staff._id,
        staffName: staff.name,
        designation: staff.designation,
        email: staff.email,
        phone: staff.phone,
        status: attendanceRecord?.status || "Not Marked",
        checkInTime: attendanceRecord?.checkInTime || "",
        checkOutTime: attendanceRecord?.checkOutTime || "",
        remarks: attendanceRecord?.remarks || "",
        _id: attendanceRecord?._id,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch attendance",
    });
  }
};

// Get attendance report for a staff
export const getStaffAttendanceReport = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { startDate, endDate, month, year } = req.query;

    let query = { staffId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.date = { $gte: start, $lte: end };
    }

    const attendance = await StaffAttendance.find(query).sort({ date: -1 });

    const stats = {
      total: attendance.length,
      present: attendance.filter((a) => a.status === "Present").length,
      absent: attendance.filter((a) => a.status === "Absent").length,
      late: attendance.filter((a) => a.status === "Late").length,
      leave: attendance.filter((a) => a.status === "Leave").length,
      halfDay: attendance.filter((a) => a.status === "Half Day").length,
    };

    stats.percentage =
      stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: attendance,
      statistics: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch attendance report",
    });
  }
};

// Get monthly attendance summary
export const getMonthlyAttendanceSummary = async (req, res) => {
  try {
    const { month, year, schoolId } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and Year are required",
      });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const query = { date: { $gte: start, $lte: end } };
    if (schoolId) query.schoolId = schoolId;

    const attendance = await StaffAttendance.find(query).populate(
      "staffId",
      "name designation",
    );

    const staffMap = {};
    attendance.forEach((record) => {
      if (!record.staffId) return;

      const staffId = record.staffId._id.toString();
      if (!staffMap[staffId]) {
        staffMap[staffId] = {
          staffId: record.staffId._id,
          staffName: record.staffId.name,
          designation: record.staffId.designation,
          present: 0,
          absent: 0,
          late: 0,
          leave: 0,
          halfDay: 0,
          total: 0,
        };
      }

      staffMap[staffId].total++;
      if (record.status === "Present") staffMap[staffId].present++;
      if (record.status === "Absent") staffMap[staffId].absent++;
      if (record.status === "Late") staffMap[staffId].late++;
      if (record.status === "Leave") staffMap[staffId].leave++;
      if (record.status === "Half Day") staffMap[staffId].halfDay++;
    });

    const summary = Object.values(staffMap).map((staff) => ({
      ...staff,
      percentage:
        staff.total > 0 ? ((staff.present / staff.total) * 100).toFixed(2) : 0,
    }));

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch monthly summary",
    });
  }
};

// Delete attendance
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await StaffAttendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete attendance",
    });
  }
};
