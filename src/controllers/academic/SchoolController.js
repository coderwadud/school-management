import School from "../../models/academic/SchoolModel.js";
import Branch from "../../models/academic/BranchModel.js";
export const createSchool = async (req, res) => {
  try {
    const { name, schoolCode, logo, email, phone, address, website } = req.body;
    const newSchool = new School({
      name,
      schoolCode,
      logo,
      email,
      phone,
      address,
      website,
    });
    const savedSchool = await newSchool.save();
    res.status(201).json(savedSchool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(200).json(school);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSchool = async (req, res) => {
  try {
    const { name, schoolCode, logo, email, phone, address, website } = req.body;
    const updatedSchool = await School.findByIdAndUpdate(
      req.params.id,
      { name, schoolCode, logo, email, phone, address, website },
        { new: true }
    );
    if (!updatedSchool) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(200).json(updatedSchool);
    } catch (error) {   
    res.status(500).json({ message: error.message });
  }
};

export const deleteSchool = async (req, res) => {
  try {
    const deletedSchool = await School.findByIdAndDelete(req.params.id);
    if (!deletedSchool) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(200).json({ message: "School deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBranchesBySchoolId = async (req, res) => {
  try {
    const branches = await Branch.find({ schoolId: req.params.schoolId });
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSchoolOptions = async (req, res) => {
  try {
    const schools = await School.find().select("name _id");
    const options = schools.map((school) => ({
      label: school.name,
      value: school._id,
    }));
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

