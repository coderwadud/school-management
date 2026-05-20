import TeacherAttendance from "../../models/attendance/TeacherAttendanceModel.js";
import Teacher from "../../models/teacher/TeacherModel.js";

// Take attendance for multiple teachers
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
        // Check if attendance already exists for this teacher on this date
        const existingAttendance = await TeacherAttendance.findOne({
          teacherId: record.teacherId,
          date: new Date(date),
        });

        if (existingAttendance) {
          // Update existing attendance
          existingAttendance.status = record.status;
          existingAttendance.checkInTime = record.checkInTime || "";
          existingAttendance.checkOutTime = record.checkOutTime || "";
          existingAttendance.remarks = record.remarks || "";
          existingAttendance.takenBy = req.user._id;
          await existingAttendance.save();
          attendanceRecords.push(existingAttendance);
        } else {
          // Create new attendance
          const newAttendance = new TeacherAttendance({
            schoolId,
            teacherId: record.teacherId,
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
          teacherId: record.teacherId,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Teacher attendance recorded successfully",
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

    const attendance = await TeacherAttendance.find(query)
      .populate("teacherId", "name designation email phone")
      .populate("takenBy", "name")
      .sort({ createdAt: -1 });

    // Get all active teachers
    const allTeachersQuery = schoolId
      ? { schoolId, status: true }
      : { status: true };
    const allTeachers = await Teacher.find(allTeachersQuery).select(
      "name designation email phone",
    );

    // Map attendance to include all teachers
    const attendanceMap = attendance.reduce((acc, record) => {
      if (record.teacherId) {
        acc[record.teacherId._id.toString()] = record;
      }
      return acc;
    }, {});

    const result = allTeachers.map((teacher) => {
      const attendanceRecord = attendanceMap[teacher._id.toString()];
      return {
        teacherId: teacher._id,
        teacherName: teacher.name,
        designation: teacher.designation,
        email: teacher.email,
        phone: teacher.phone,
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

// Get attendance report for a teacher
export const getTeacherAttendanceReport = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { startDate, endDate, month, year } = req.query;

    let query = { teacherId };

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

    const attendance = await TeacherAttendance.find(query).sort({ date: -1 });

    // Calculate statistics
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

    const attendance = await TeacherAttendance.find(query).populate(
      "teacherId",
      "name designation",
    );

    // Group by teacher
    const teacherMap = {};
    attendance.forEach((record) => {
      if (!record.teacherId) return;

      const teacherId = record.teacherId._id.toString();
      if (!teacherMap[teacherId]) {
        teacherMap[teacherId] = {
          teacherId: record.teacherId._id,
          teacherName: record.teacherId.name,
          designation: record.teacherId.designation,
          present: 0,
          absent: 0,
          late: 0,
          leave: 0,
          halfDay: 0,
          total: 0,
        };
      }

      teacherMap[teacherId].total++;
      if (record.status === "Present") teacherMap[teacherId].present++;
      if (record.status === "Absent") teacherMap[teacherId].absent++;
      if (record.status === "Late") teacherMap[teacherId].late++;
      if (record.status === "Leave") teacherMap[teacherId].leave++;
      if (record.status === "Half Day") teacherMap[teacherId].halfDay++;
    });

    const summary = Object.values(teacherMap).map((teacher) => ({
      ...teacher,
      percentage:
        teacher.total > 0
          ? ((teacher.present / teacher.total) * 100).toFixed(2)
          : 0,
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
    const attendance = await TeacherAttendance.findByIdAndDelete(req.params.id);

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
