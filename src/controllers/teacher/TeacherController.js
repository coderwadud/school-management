import School from "../../models/academic/SchoolModel.js";
import Teacher from "../../models/teacher/TeacherModel.js";
import bcrypt from "bcrypt";

// Create a new teacher
export const createTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      nid,
      bloodGroup,
      password,
      designation,
      educationQualification,
      joiningDate,
      dateOfBirth,
      address,
      salary,
      gender,
      religion,
      maritalStatus,
    } = req.body;
    const schoolId = req.schoolId; // Get schoolId from authenticated user
    const image = req.files?.image?.[0]?.path || null;

    // Validate required fields
    if (!name || !schoolId || !email || !phone || !nid || !password) {
      return res.status(400).json({
        message: "Name, School ID, Email, Phone, NID and Password are required",
      });
    }

    // Check if the school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // Check if the teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res
        .status(409)
        .json({ message: "Teacher with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new teacher
    const newTeacher = new Teacher({
      name,
      schoolId,
      email,
      phone,
      nid,
      bloodGroup,
      image,
      password: hashedPassword,
      designation,
      educationQualification,
      joiningDate,
      dateOfBirth,
      address,
      salary,
      gender,
      religion,
      maritalStatus,
    });

    await newTeacher.save();

    res
      .status(201)
      .json({ message: "Teacher created successfully", teacher: newTeacher });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("schoolId");
    res
      .status(200)
      .json({ message: "Teachers retrieved successfully", teachers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get a teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).populate("schoolId");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res
      .status(200)
      .json({ message: "Teacher retrieved successfully", teacher });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Update a teacher
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      nid,
      bloodGroup,
      password,
      designation,
      educationQualification,
      joiningDate,
      dateOfBirth,
      address,
      salary,
      gender,
      religion,
      maritalStatus,
    } = req.body;
    const schoolId = req.schoolId; // Get schoolId from authenticated user
    const image = req.files?.image?.[0]?.path || null;

    // Check if the teacher exists
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      phone,
      nid,
      bloodGroup,
      designation,
      educationQualification,
      joiningDate,
      dateOfBirth,
      address,
      salary,
      gender,
      religion,
      maritalStatus,
    };

    // Add image to update data if provided
    if (image) {
      updateData.image = image;
    }

    // Check if email is being updated and if it's already taken by another teacher
    if (
      updateData.email &&
      updateData.email.toLowerCase() !== teacher.email.toLowerCase()
    ) {
      const existingTeacherWithEmail = await Teacher.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });
      if (existingTeacherWithEmail) {
        return res
          .status(409)
          .json({ message: "Email is already in use by another teacher" });
      }
    }

    // Check if NID is being updated and if it's already taken by another teacher
    if (
      updateData.nid &&
      updateData.nid.toString() !== teacher.nid.toString()
    ) {
      const existingTeacherWithNID = await Teacher.findOne({
        nid: updateData.nid,
        _id: { $ne: id },
      });
      if (existingTeacherWithNID) {
        return res
          .status(409)
          .json({ message: "NID is already in use by another teacher" });
      }
    }

    // Hash password if it's being updated
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update the updatedAt timestamp
    updateData.updatedAt = Date.now();

    // Update the teacher
    Object.assign(teacher, updateData);
    await teacher.save();

    res.status(200).json({ message: "Teacher updated successfully", teacher });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Delete a teacher
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// teacher status toggle
export const toggleTeacherStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    // Toggle the teacher status
    teacher.status = !teacher.status;
    await teacher.save();
    res
      .status(200)
      .json({ message: "Teacher status toggled successfully", teacher });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Teacher options
export const getTeacherOptions = async (req, res) => {
  try {
    const teachers = await Teacher.find({ status: true }).select("name _id");
    const options = teachers.map((teacher) => ({
      label: teacher.name,
      value: teacher._id,
    }));
    res.status(200).json(options);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
