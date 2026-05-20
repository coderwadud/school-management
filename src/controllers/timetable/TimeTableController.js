import TimeTable from "../../models/timetable/TimeTableModel.js";
import Class from "../../models/academic/ClassModel.js";
import Section from "../../models/academic/SectionModel.js";
import Subject from "../../models/academic/SubjectModel.js";
import Teacher from "../../models/teacher/TeacherModel.js";
import Session from "../../models/academic/SessionModel.js";
import Shift from "../../models/academic/ShiftModel.js";
import Group from "../../models/academic/GroupModel.js";
import Medium from "../../models/academic/MediumModel.js";

// Create time table for a class
export const createTimeTable = async (req, res) => {
  try {
    const {
      classId,
      sectionId,
      sessionId,
      shiftId,
      groupId,
      mediumId,
      dayOfWeek,
      subjectId,
      teacherId,
      startTime,
      endTime,
      roomNumber,
      remarks,
    } = req.body;
    const schoolId = req.schoolId;
    const timeTable = new TimeTable({
      classId,
      sectionId,
      schoolId,
      sessionId,
      shiftId,
      groupId,
      mediumId,
      dayOfWeek,
      subjectId,
      teacherId,
      startTime,
      endTime,
      roomNumber,
      remarks,
    });
    await timeTable.save();
    res.status(201).json({
      message: "Time table created successfully",
      data: timeTable,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create time table",
      error: error.message || "Failed to create time table",
    });
  }
};

// get time table
export const getTimeTable = async (req, res) => {
  try {
    const timeTables = await TimeTable.find()
      .populate("classId", "name")
      .populate("sectionId", "name")
      .populate("sessionId", "name")
      .populate("shiftId", "name")
      .populate("groupId", "name")
      .populate("mediumId", "name")
      .populate("subjectId", "name")
      .populate("teacherId", "name");
    const timeTableDAta = timeTables.map((timeTable) => {
      return {
        id: timeTable._id,
        classId: timeTable.classId ? timeTable.classId.name : null,
        sectionId: timeTable.sectionId ? timeTable.sectionId.name : null,
        sessionId: timeTable.sessionId ? timeTable.sessionId.name : null,
        shiftId: timeTable.shiftId ? timeTable.shiftId.name : null,
        groupId: timeTable.groupId ? timeTable.groupId.name : null,
        mediumId: timeTable.mediumId ? timeTable.mediumId.name : null,
        dayOfWeek: timeTable.dayOfWeek,
        subjectId: timeTable.subjectId ? timeTable.subjectId.name : null,
        teacherId: timeTable.teacherId ? timeTable.teacherId.name : null,
        startTime: timeTable.startTime,
        endTime: timeTable.endTime,
        roomNumber: timeTable.roomNumber,
        remarks: timeTable.remarks,
        status: timeTable.status,
      };
    });
    res.status(200).json({
      message: "Time table fetched successfully",
      data: timeTableDAta,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get time table",
      error: error.message || "Failed to get time table",
    });
  }
};

export const updateTimeTable = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      classId,
      sectionId,
      sessionId,
      shiftId,
      groupId,
      mediumId,
      dayOfWeek,
      subjectId,
      teacherId,
      startTime,
      endTime,
      roomNumber,
      remarks,
      status,
    } = req.body;
    const schoolId = req.schoolId;
    const updatedTimeTable = await TimeTable.findByIdAndUpdate(
      id,
      {
        classId,
        sectionId,
        schoolId,
        sessionId,
        shiftId,
        groupId,
        mediumId,
        dayOfWeek,
        subjectId,
        teacherId,
        startTime,
        endTime,
        roomNumber,
        remarks,
        status,
      },
      { new: true }
    );
    if (!updatedTimeTable) {
      return res.status(404).json({ message: "Time table not found" });
    }
    res.status(200).json({
      message: "Time table updated successfully",
      data: updatedTimeTable,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update time table",
      error: error.message || "Failed to update time table",
    });
  }
};

export const getTimeTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const timeTable = await TimeTable.findById(id)
      .populate("classId", "_id")
      .populate("sectionId", "_id")
      .populate("sessionId", "_id")
      .populate("shiftId", "_id")
      .populate("groupId", "_id")
      .populate("mediumId", "_id")
      .populate("subjectId", "_id")
      .populate("teacherId", "_id");
      const formattedTimeTable = {
        id: timeTable._id,
        classId: timeTable.classId ? timeTable.classId._id : null,
        sectionId: timeTable.sectionId ? timeTable.sectionId._id : null,
        sessionId: timeTable.sessionId ? timeTable.sessionId._id : null,
        shiftId: timeTable.shiftId ? timeTable.shiftId._id : null,
        groupId: timeTable.groupId ? timeTable.groupId._id : null,
        mediumId: timeTable.mediumId ? timeTable.mediumId._id : null,
        subjectId: timeTable.subjectId ? timeTable.subjectId._id : null,
        teacherId: timeTable.teacherId ? timeTable.teacherId._id : null,
        dayOfWeek: timeTable.dayOfWeek,
        startTime: timeTable.startTime,
        endTime: timeTable.endTime,
        roomNumber: timeTable.roomNumber,
        remarks: timeTable.remarks,
        status: timeTable.status,
      };
    if (!timeTable) {
      return res.status(404).json({ message: "Time table not found" });
    }
    res.status(200).json({
      message: "Time table fetched successfully",
      data: formattedTimeTable,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get time table",
      error: error.message || "Failed to get time table",
    });
  }
};

export const deleteTimeTable = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTimeTable = await TimeTable.findByIdAndDelete(id);
    if (!deletedTimeTable) {
      return res.status(404).json({ message: "Time table not found" });
    }
    res.status(200).json({
      message: "Time table deleted successfully",
      data: deletedTimeTable,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete time table",
      error: error.message || "Failed to delete time table",
    });
  }
};

export const toggleTimeTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const timeTable = await TimeTable.findById(id);
    if (!timeTable) {
      return res.status(404).json({ message: "Time table not found" });
    }
    timeTable.status = !timeTable.status;
    await timeTable.save();
    res.status(200).json({
      message: "Time table status toggled successfully",
      data: timeTable,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to toggle time table status",
      error: error.message || "Failed to toggle time table status",
    });
  }
};