import Student from "../../models/student/StudentModel.js";
import mongoose from "mongoose";

// Promote students to next class
export const promoteStudents = async (req, res) => {
  try {
    const { studentIds, newClassId, newSectionId, newSessionId } = req.body;

    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student IDs are required",
      });
    }

    const promotedStudents = [];
    const errors = [];

    for (const studentId of studentIds) {
      try {
        const student = await Student.findById(studentId);
        if (!student) {
          errors.push({
            studentId,
            error: "Student not found",
          });
          continue;
        }

        // Update academic information
        student.academicInformation.studentClass = newClassId;
        student.academicInformation.section = newSectionId;
        if (newSessionId) {
          student.academicInformation.session = newSessionId;
        }

        await student.save();
        promotedStudents.push(student);
      } catch (error) {
        errors.push({
          studentId,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Students promoted successfully",
      data: promotedStudents,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to promote students",
    });
  }
};

// Transfer student to another school
export const transferStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const {
      transferDate,
      transferReason,
      newSchoolName,
      newSchoolAddress,
      tcNumber,
      remarks,
    } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Add transfer information (you might want to create a separate Transfer model)
    student.status = false; // Deactivate student

    // Store transfer info in student record or create separate transfer record
    const transferData = {
      studentId,
      transferDate: transferDate || new Date(),
      transferReason,
      newSchoolName,
      newSchoolAddress,
      tcNumber,
      remarks,
    };

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student transferred successfully",
      data: {
        student,
        transferInfo: transferData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to transfer student",
    });
  }
};

// Generate Transfer Certificate
export const generateTC = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId)
      .populate("academicInformation.session", "name")
      .populate("academicInformation.studentClass", "name")
      .populate("academicInformation.section", "name")
      .populate("academicInformation.medium", "name")
      .populate("academicInformation.shift", "name");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Generate TC data (ready for PDF generation)
    const tcData = {
      studentInfo: {
        name: `${student.personalInformation.firstName} ${student.personalInformation.lastName}`,
        fatherName: student.guardianInformation.fatherName,
        motherName: student.guardianInformation.motherName,
        dateOfBirth: student.personalInformation.dateOfBirth,
        class: student.academicInformation.studentClass?.name,
        section: student.academicInformation.section?.name,
        session: student.academicInformation.session?.name,
        admissionDate: student.createdAt,
      },
      tcNumber: `TC${Date.now()}`,
      issueDate: new Date(),
      conduct: "Good",
      remarks: "All dues cleared",
    };

    res.status(200).json({
      success: true,
      message: "Transfer certificate data generated",
      data: tcData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate TC",
    });
  }
};

// Get promotion eligible students
export const getPromotionEligibleStudents = async (req, res) => {
  try {
    const { classId, sectionId, sessionId } = req.query;

    const query = {
      status: true,
      "academicInformation.studentClass": classId,
    };

    if (sectionId) query["academicInformation.section"] = sectionId;
    if (sessionId) query["academicInformation.session"] = sessionId;

    const students = await Student.find(query)
      .populate("academicInformation.studentClass", "name")
      .populate("academicInformation.section", "name")
      .select("personalInformation academicInformation");

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch students",
    });
  }
};
