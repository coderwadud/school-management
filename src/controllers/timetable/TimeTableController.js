import TimeTable from "../../models/timetable/TimeTableModel.js";

// Create time table for a class
export const createTimeTable = async (req, res) => {
  try {
    const timeTable = new TimeTable(req.body);
    await timeTable.save();

    res.status(201).json({
      success: true,
      message: "Time table created successfully",
      data: timeTable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create time table",
    });
  }
};

// Get time table by class and section
export const getTimeTableByClass = async (req, res) => {
  try {
    const { classId, sectionId, sessionId } = req.query;

    const query = { status: true };
    if (classId) query.classId = classId;
    if (sectionId) query.sectionId = sectionId;
    if (sessionId) query.sessionId = sessionId;

    const timeTables = await TimeTable.find(query)
      .populate("classId", "name")
      .populate("sectionId", "name")
      .populate("sessionId", "name")
      .populate("shiftId", "name startTime endTime")
      .populate("periods.subjectId", "name code")
      .populate("periods.teacherId", "personalInformation")
      .sort({ dayOfWeek: 1 });

    res.status(200).json({
      success: true,
      data: timeTables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch time table",
    });
  }
};

// Get time table by day
export const getTimeTableByDay = async (req, res) => {
  try {
    const { classId, sectionId, dayOfWeek } = req.query;

    const timeTable = await TimeTable.findOne({
      classId,
      sectionId,
      dayOfWeek,
      status: true,
    })
      .populate("classId", "name")
      .populate("sectionId", "name")
      .populate("periods.subjectId", "name code")
      .populate("periods.teacherId", "personalInformation");

    if (!timeTable) {
      return res.status(404).json({
        success: false,
        message: "Time table not found for this day",
      });
    }

    res.status(200).json({
      success: true,
      data: timeTable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch time table",
    });
  }
};

// Get teacher's time table
export const getTeacherTimeTable = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const timeTables = await TimeTable.find({
      "periods.teacherId": teacherId,
      status: true,
    })
      .populate("classId", "name")
      .populate("sectionId", "name")
      .populate("periods.subjectId", "name code")
      .sort({ dayOfWeek: 1 });

    // Format the response to show only relevant periods for this teacher
    const formattedTimeTables = timeTables.map((tt) => ({
      _id: tt._id,
      class: tt.classId,
      section: tt.sectionId,
      dayOfWeek: tt.dayOfWeek,
      periods: tt.periods.filter(
        (p) => p.teacherId && p.teacherId.toString() === teacherId,
      ),
    }));

    res.status(200).json({
      success: true,
      data: formattedTimeTables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch teacher time table",
    });
  }
};

// Update time table
export const updateTimeTable = async (req, res) => {
  try {
    const timeTable = await TimeTable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!timeTable) {
      return res.status(404).json({
        success: false,
        message: "Time table not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Time table updated successfully",
      data: timeTable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update time table",
    });
  }
};

// Delete time table
export const deleteTimeTable = async (req, res) => {
  try {
    const timeTable = await TimeTable.findByIdAndDelete(req.params.id);

    if (!timeTable) {
      return res.status(404).json({
        success: false,
        message: "Time table not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Time table deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete time table",
    });
  }
};

// Toggle time table status
export const toggleTimeTableStatus = async (req, res) => {
  try {
    const timeTable = await TimeTable.findById(req.params.id);

    if (!timeTable) {
      return res.status(404).json({
        success: false,
        message: "Time table not found",
      });
    }

    timeTable.status = !timeTable.status;
    await timeTable.save();

    res.status(200).json({
      success: true,
      message: "Time table status updated successfully",
      data: timeTable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update time table status",
    });
  }
};
