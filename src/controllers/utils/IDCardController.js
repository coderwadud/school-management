import Student from "../../models/student/StudentModel.js";

// Generate ID Card data for a student
export const generateStudentIDCard = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId)
      .populate("academicInformation.session", "name")
      .populate("academicInformation.studentClass", "name")
      .populate("academicInformation.section", "name")
      .populate("academicInformation.medium", "name")
      .populate("academicInformation.shift", "name")
      .populate("academicInformation.group", "name");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const idCardData = {
      studentId: student._id,
      idNumber: `STU${String(student._id).slice(-6).toUpperCase()}`,
      name: `${student.personalInformation.firstName} ${student.personalInformation.lastName}`,
      fatherName: student.guardianInformation.fatherName,
      motherName: student.guardianInformation.motherName,
      class: student.academicInformation.studentClass?.name || "",
      section: student.academicInformation.section?.name || "",
      group: student.academicInformation.group?.name || "",
      session: student.academicInformation.session?.name || "",
      shift: student.academicInformation.shift?.name || "",
      bloodGroup: student.personalInformation.bloodGroup || "",
      dateOfBirth: student.personalInformation.dateOfBirth,
      contactNumber: student.personalInformation.contactNumber || "",
      address: student.personalInformation.presentAddress || "",
      photo: student.personalInformation.studentPicture || "",
      validUntil: new Date(new Date().getFullYear() + 1, 11, 31), // Valid till end of next year
    };

    res.status(200).json({
      success: true,
      message: "ID Card data generated successfully",
      data: idCardData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate ID Card",
    });
  }
};

// Generate ID Cards for multiple students
export const generateBulkIDCards = async (req, res) => {
  try {
    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student IDs array is required",
      });
    }

    const students = await Student.find({ _id: { $in: studentIds } })
      .populate("academicInformation.session", "name")
      .populate("academicInformation.studentClass", "name")
      .populate("academicInformation.section", "name")
      .populate("academicInformation.medium", "name")
      .populate("academicInformation.shift", "name")
      .populate("academicInformation.group", "name");

    const idCards = students.map((student) => ({
      studentId: student._id,
      idNumber: `STU${String(student._id).slice(-6).toUpperCase()}`,
      name: `${student.personalInformation.firstName} ${student.personalInformation.lastName}`,
      fatherName: student.guardianInformation.fatherName,
      class: student.academicInformation.studentClass?.name || "",
      section: student.academicInformation.section?.name || "",
      group: student.academicInformation.group?.name || "",
      session: student.academicInformation.session?.name || "",
      bloodGroup: student.personalInformation.bloodGroup || "",
      photo: student.personalInformation.studentPicture || "",
    }));

    res.status(200).json({
      success: true,
      message: "ID Cards data generated successfully",
      data: idCards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate ID Cards",
    });
  }
};

// Generate ID Cards by class
export const generateClassIDCards = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;

    const query = {
      status: true,
      "academicInformation.studentClass": classId,
    };

    if (sectionId) {
      query["academicInformation.section"] = sectionId;
    }

    const students = await Student.find(query)
      .populate("academicInformation.session", "name")
      .populate("academicInformation.studentClass", "name")
      .populate("academicInformation.section", "name")
      .populate("academicInformation.group", "name")
      .sort("personalInformation.firstName");

    const idCards = students.map((student) => ({
      studentId: student._id,
      idNumber: `STU${String(student._id).slice(-6).toUpperCase()}`,
      name: `${student.personalInformation.firstName} ${student.personalInformation.lastName}`,
      fatherName: student.guardianInformation.fatherName,
      class: student.academicInformation.studentClass?.name || "",
      section: student.academicInformation.section?.name || "",
      group: student.academicInformation.group?.name || "",
      session: student.academicInformation.session?.name || "",
      bloodGroup: student.personalInformation.bloodGroup || "",
      photo: student.personalInformation.studentPicture || "",
    }));

    res.status(200).json({
      success: true,
      message: "ID Cards data generated successfully",
      data: idCards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate ID Cards",
    });
  }
};
