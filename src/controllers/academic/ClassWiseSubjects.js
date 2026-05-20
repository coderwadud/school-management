import ClassWiseSubjects from "../../models/academic/ClassWiseSubjectsModel.js";
import Subject from "../../models/academic/SubjectModel.js";
import School from "../../models/academic/SchoolModel.js";
import sessionId from "../../models/academic/SessionModel.js";
import shiftId from "../../models/academic/ShiftModel.js";
import mediumId from "../../models/academic/MediumModel.js";
import groupId from "../../models/academic/GroupModel.js";
import sectionId from "../../models/academic/SectionModel.js";
import Class from "../../models/academic/ClassModel.js";

export const createClassWiseSubjects = async (req, res) => {
    try {
        const schoolId = req.schoolId;
        const { name, classId, subjectId, sessionId, shiftId, mediumId, groupId, sectionId, status } = req.body;
        // Check if the school exists
        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: "School not found" });
        }
        // Check if the class exists
        const classExists = await Class.findById(classId);
        if (!classExists) {
            return res.status(404).json({ message: "Class not found" });
        }
        // Check if the subjects exist
        const subjectsExist = await Subject.find({ _id: { $in: subjectId } });
        if (subjectsExist.length !== subjectId.length) {
            return res.status(404).json({ message: "One or more subjects not found" });
        }
        const newClassWiseSubjects = new ClassWiseSubjects({
            name,
            schoolId,
            classId,
            subjectId,
            sessionId,
            shiftId,
            mediumId,
            groupId,
            sectionId,
            status
        });
        const savedClassWiseSubjects = await newClassWiseSubjects.save();
        res.status(201).json({
            message: "Class-wise subjects created successfully",
            data: savedClassWiseSubjects
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getClassWiseSubjects = async (req, res) => {
    try {
        const classWiseSubjects = await ClassWiseSubjects.find()
        .populate("classId", "name")
        .populate("subjectId", "name")
        .populate("sessionId", "name")
        .populate("shiftId", "name")
        .populate("mediumId", "name")
        .populate("groupId", "name")
        .populate("sectionId", "name");
        const formattedClassWiseSubjects = classWiseSubjects.map(cws => ({
            id: cws._id,
            name: cws.name,
            classId: cws.classId ? cws.classId.name : null,
            subjectId: cws.subjectId ? cws.subjectId.map(subject => subject.name) : [],
            sessionId: cws.sessionId ? cws.sessionId.name : null,
            shiftId: cws.shiftId ? cws.shiftId.name : null,
            mediumId: cws.mediumId ? cws.mediumId.name : null,
            groupId: cws.groupId ? cws.groupId.name : null,
            sectionId: cws.sectionId ? cws.sectionId.name : null,
            status: cws.status
        }));
        res.status(200).json({
            message: "Class-wise subjects retrieved successfully",
            data: formattedClassWiseSubjects
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateClassWiseSubjects = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, classId, subjectId, sessionId, shiftId, mediumId, groupId, sectionId, status } = req.body;
        const updatedClassWiseSubjects = await ClassWiseSubjects.findByIdAndUpdate(
            id,
            { name, classId, subjectId, sessionId, shiftId, mediumId, groupId, sectionId, status },
            { new: true }
        );
        if (!updatedClassWiseSubjects) {
            return res.status(404).json({ message: "Class-wise subjects not found" });
        }
        res.status(200).json({
            message: "Class-wise subjects updated successfully",
            data: updatedClassWiseSubjects
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteClassWiseSubjects = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClassWiseSubjects = await ClassWiseSubjects.findByIdAndDelete(id);
        if (!deletedClassWiseSubjects) {
            return res.status(404).json({ message: "Class-wise subjects not found" });
        }
        res.status(200).json({
            message: "Class-wise subjects deleted successfully",
            data: deletedClassWiseSubjects
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getClassWiseSubjectsById = async (req, res) => {
    try {
        const { id } = req.params;
        const classWiseSubjects = await ClassWiseSubjects.findById(id)
        .populate("classId", "name")
        .populate("subjectId", "name")
        .populate("sessionId", "name")
        .populate("shiftId", "name")
        .populate("mediumId", "name")
        .populate("groupId", "name")
        .populate("sectionId", "name");
        if (!classWiseSubjects) {
            return res.status(404).json({ message: "Class-wise subjects not found" });
        }
        const formattedClassWiseSubjects = {
            id: classWiseSubjects._id,
            name: classWiseSubjects.name,
            classId: classWiseSubjects.classId ? classWiseSubjects.classId._id : null,
            subjectId: classWiseSubjects.subjectId ? classWiseSubjects.subjectId.map(subject => subject._id) : [],
            sessionId: classWiseSubjects.sessionId ? classWiseSubjects.sessionId._id : null,
            shiftId: classWiseSubjects.shiftId ? classWiseSubjects.shiftId._id : null,
            mediumId: classWiseSubjects.mediumId ? classWiseSubjects.mediumId._id : null,
            groupId: classWiseSubjects.groupId ? classWiseSubjects.groupId._id : null,
            sectionId: classWiseSubjects.sectionId ? classWiseSubjects.sectionId._id : null,
            status: classWiseSubjects.status
        };
        res.status(200).json({
            message: "Class-wise subjects retrieved successfully",
            data: formattedClassWiseSubjects
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleClassWiseSubjectsStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const classWiseSubjects = await ClassWiseSubjects.findById(id);
        if (!classWiseSubjects) {
            return res.status(404).json({ message: "Class-wise subjects not found" });
        }
        classWiseSubjects.status = !classWiseSubjects.status;
        const updatedClassWiseSubjects = await classWiseSubjects.save();
        res.status(200).json({
            message: "Class-wise subjects status toggled successfully",
            data: updatedClassWiseSubjects
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getClassWiseSubjectsOptions = async (req, res) => {
    try {
        const classWiseSubjects = await ClassWiseSubjects.find({ status: true }).select("name");
        const options = classWiseSubjects.map(cws => ({
            label: cws.name,
            value: cws._id
        }));
        res.status(200).json(options);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};