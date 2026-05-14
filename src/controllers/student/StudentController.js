import Student from "../../models/student/StudentModel.js";
import Session from "../../models/academic/SessionModel.js";
import Shift from "../../models/academic/ShiftModel.js";
import Medium from "../../models/academic/MediumModel.js";
import Class from "../../models/academic/ClassModel.js";
import Group from "../../models/academic/GroupModel.js";
import Section from "../../models/academic/SectionModel.js";

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
            studentPicture,
            presentAddress,
            permanentAddress,
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
        } = req.body;
        // Validate required fields
        if (!session || !shift || !medium || !studentClass || !group || !section || !firstName || !lastName || !dateOfBirth || !gender) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // Check if referenced documents exist
        const sessionExists = await Session.findById(session);
        const shiftExists = await Shift.findById(shift);
        const mediumExists = await Medium.findById(medium);
        const classExists = await Class.findById(studentClass);
        const groupExists = await Group.findById(group);
        const sectionExists = await Section.findById(section);

        if (!sessionExists || !shiftExists || !mediumExists || !classExists || !groupExists || !sectionExists) {
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

