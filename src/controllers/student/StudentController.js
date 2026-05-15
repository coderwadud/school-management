import Student from "../../models/student/StudentModel.js";
import Session from "../../models/academic/SessionModel.js";
import Shift from "../../models/academic/ShiftModel.js";
import Medium from "../../models/academic/MediumModel.js";
import Class from "../../models/academic/ClassModel.js";
import Group from "../../models/academic/GroupModel.js";
import Section from "../../models/academic/SectionModel.js";
import ClassWiseSubjects from "../../models/academic/ClassWiseSubjectsModel.js";

export const createStudent = async (req, res) => {
  try {
    const {
      session,
      shift,
      medium,
      studentClass,
      group,
      section,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bloodGroup,
      birthRegistrationNo,
      religion,
      nationality,
      email,
      contactNumber,
      presentAddress,
      permanentAddress,
      fatherName,
      fatherNid,
      motherName,
      motherNid,
      fatherProfession,
      motherProfession,
      fatherContactNumber,
      motherContactNumber,
      guardianName,
      guardianContactNumber,
      guardianAddress,
    } = req.body;

    // Get uploaded files from cloudinary (uploaded via multer middleware)
    const studentPicture = req.files?.studentPicture?.[0]?.path || null;
    const fatherPicture = req.files?.fatherPicture?.[0]?.path || null;
    const motherPicture = req.files?.motherPicture?.[0]?.path || null;

    // Validate required fields
    if (
      !session ||
      !shift ||
      !medium ||
      !studentClass ||
      !group ||
      !section ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !gender
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // Check if referenced documents exist
    const sessionExists = await Session.findById(session);
    const shiftExists = await Shift.findById(shift);
    const mediumExists = await Medium.findById(medium);
    const classExists = await Class.findById(studentClass);
    const groupExists = await Group.findById(group);
    const sectionExists = await Section.findById(section);

    if (
      !sessionExists ||
      !shiftExists ||
      !mediumExists ||
      !classExists ||
      !groupExists ||
      !sectionExists
    ) {
      return res.status(404).json({ message: "Referenced document not found" });
    }
    const newStudent = new Student({
      academicInformation: {
        session,
        shift,
        medium,
        studentClass,
        group,
        section,
      },
      personalInformation: {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        bloodGroup,
        birthRegistrationNo,
        religion,
        nationality,
        email,
        contactNumber,
        studentPicture,
        presentAddress,
        permanentAddress,
      },
      guardianInformation: {
        fatherName,
        fatherNid,
        motherName,
        motherNid,
        fatherProfession,
        motherProfession,
        fatherPicture,
        motherPicture,
        fatherContactNumber,
        motherContactNumber,
        guardianName,
        guardianContactNumber,
        guardianAddress,
      },
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all students with their class and subject information
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("academicInformation.session", "name")
      .populate("academicInformation.shift", "name")
      .populate("academicInformation.medium", "name")
      .populate("academicInformation.studentClass", "name")
      .populate("academicInformation.group", "name")
      .populate("academicInformation.section", "name");

    // For each student, get their subjects based on their class
    const studentsWithSubjects = await Promise.all(
      students.map(async (student) => {
        const classId = student.academicInformation.studentClass._id;
        const classSubjects = await ClassWiseSubjects.findOne({
          classId,
        }).populate("subjectId", "name");

        return {
          ...student.toObject(),
          subjects: classSubjects ? classSubjects.subjectId : [],
        };
      }),
    );

    res.status(200).json(studentsWithSubjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single student by ID with their class and subject information
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate("academicInformation.session", "name")
      .populate("academicInformation.shift", "name")
      .populate("academicInformation.medium", "name")
      .populate("academicInformation.studentClass", "name")
      .populate("academicInformation.group", "name")
      .populate("academicInformation.section", "name");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get subjects based on student's class
    const classId = student.academicInformation.studentClass._id;
    const classSubjects = await ClassWiseSubjects.findOne({ classId }).populate(
      "subjectId",
      "name",
    );

    const studentWithSubjects = {
      ...student.toObject(),
      subjects: classSubjects ? classSubjects.subjectId : [],
    };

    res.status(200).json(studentWithSubjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
