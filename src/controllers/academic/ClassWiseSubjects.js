import ClassWiseSubjects from "../../models/academic/ClassWiseSubjectsModel.js";
import School from "../../models/academic/SchoolModel.js";
import Class from "../../models/academic/ClassModel.js";
import Subject from "../../models/academic/SubjectModel.js";

export const createClassWiseSubjects = async (req, res) => {
    try {
        const schoolId = req.schoolId;
        const { name, classId, subjectId } = req.body;
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
        });
        const savedClassWiseSubjects = await newClassWiseSubjects.save();
        res.status(201).json(savedClassWiseSubjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getClassWiseSubjects = async (req, res) => {
    try {
        const classWiseSubjects = await ClassWiseSubjects.find().populate("schoolId", "name").populate("classId", "name").populate("subjectId", "name");
        res.status(200).json(classWiseSubjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};