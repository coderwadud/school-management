import StudentAttendance from "../../models/attendance/StudentAttendanceModel.js";
import Student from "../../models/student/StudentModel.js";

// Take attendance for multiple students
export const takeAttendance = async (req, res) => {
  try {
    const { attendance, date, classId, sectionId, schoolId } = req.body;

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
        // Check if attendance already exists for this student on this date
        const existingAttendance = await StudentAttendance.findOne({
          studentId: record.studentId,
          date: new Date(date),
        });

        if (existingAttendance) {
          // Update existing attendance
          existingAttendance.status = record.status;
          existingAttendance.remarks = record.remarks || "";
          existingAttendance.takenBy = req.user._id;
          await existingAttendance.save();
          attendanceRecords.push(existingAttendance);
        } else {
          // Create new attendance
          const newAttendance = new StudentAttendance({
            schoolId,
            studentId: record.studentId,
            classId,
            sectionId,
            date: new Date(date),
            status: record.status,
            remarks: record.remarks || "",
            takenBy: req.user._id,
          });
          await newAttendance.save();
          attendanceRecords.push(newAttendance);
        }
      } catch (error) {
        errors.push({
          studentId: record.studentId,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Attendance recorded successfully",
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

// Get attendance by date, class, and section
export const getAttendanceByClassAndDate = async (req, res) => {
  try {
    const { classId, sectionId, date } = req.query;

    if (!classId || !sectionId || !date) {
      return res.status(400).json({
        success: false,
        message: "Class ID, Section ID, and Date are required",
      });
    }

    const attendance = await StudentAttendance.find({
      classId,
      sectionId,
      date: new Date(date),
    })
      .populate(
        "studentId",
        "personalInformation.firstName personalInformation.lastName",
      )
      .populate("takenBy", "name")
      .sort({ createdAt: -1 });

    // Get all students in this class and section
    const allStudents = await Student.find({
      "academicInformation.studentClass": classId,
      "academicInformation.section": sectionId,
      status: true,
    }).select("personalInformation.firstName personalInformation.lastName");

    // Map attendance to include all students
    const attendanceMap = attendance.reduce((acc, record) => {
      if (record.studentId) {
        acc[record.studentId._id.toString()] = record;
      }
      return acc;
    }, {});

    const result = allStudents.map((student) => {
      const attendanceRecord = attendanceMap[student._id.toString()];
      return {
        studentId: student._id,
        studentName: `${student.personalInformation.firstName} ${student.personalInformation.lastName}`,
        status: attendanceRecord?.status || "Not Marked",
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

// Get attendance report for a student
export const getStudentAttendanceReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, month, year } = req.query;

    let query = { studentId };

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

    const attendance = await StudentAttendance.find(query)
      .populate("classId", "name")
      .populate("sectionId", "name")
      .sort({ date: -1 });

    // Calculate statistics
    const stats = {
      total: attendance.length,
      present: attendance.filter((a) => a.status === "Present").length,
      absent: attendance.filter((a) => a.status === "Absent").length,
      late: attendance.filter((a) => a.status === "Late").length,
      leave: attendance.filter((a) => a.status === "Leave").length,
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

// Get monthly attendance summary for class
export const getMonthlyAttendanceSummary = async (req, res) => {
  try {
    const { classId, sectionId, month, year } = req.query;

    if (!classId || !sectionId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Class ID, Section ID, Month, and Year are required",
      });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const attendance = await StudentAttendance.find({
      classId,
      sectionId,
      date: { $gte: start, $lte: end },
    }).populate(
      "studentId",
      "personalInformation.firstName personalInformation.lastName",
    );

    // Group by student
    const studentMap = {};
    attendance.forEach((record) => {
      if (!record.studentId) return;

      const studentId = record.studentId._id.toString();
      if (!studentMap[studentId]) {
        studentMap[studentId] = {
          studentId: record.studentId._id,
          studentName: `${record.studentId.personalInformation.firstName} ${record.studentId.personalInformation.lastName}`,
          present: 0,
          absent: 0,
          late: 0,
          leave: 0,
          total: 0,
        };
      }

      studentMap[studentId].total++;
      if (record.status === "Present") studentMap[studentId].present++;
      if (record.status === "Absent") studentMap[studentId].absent++;
      if (record.status === "Late") studentMap[studentId].late++;
      if (record.status === "Leave") studentMap[studentId].leave++;
    });

    const summary = Object.values(studentMap).map((student) => ({
      ...student,
      percentage:
        student.total > 0
          ? ((student.present / student.total) * 100).toFixed(2)
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
    const attendance = await StudentAttendance.findByIdAndDelete(req.params.id);

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
