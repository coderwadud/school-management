import School from "../models/academic/SchoolModel.js";
import Teacher from "../models/teacher/TeacherModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

// Login controller for both school and teacher
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check if school exists
    const school = await School.findOne({ email });
    if (school) {
      // Check password
      const isPasswordValid = await bcrypt.compare(password, school.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token for school
      const token = jwt.sign(
        { userId: school._id, email: school.email, userType: "school" },
        config.jwtSecret,
        { expiresIn: "7d" },
      );

      // Return success response with token
      return res.status(200).json({
        message: "Login successful",
        data: {
        token,
        userType: "school",
        user: {
          id: school._id,
          name: school.name,
          email: school.email,
          schoolCode: school.schoolCode,
        },
        }
      });
    }

    // Check if teacher exists
    const teacher = await Teacher.findOne({ email }).populate(
      "schoolId",
      "name",
    );
    if (teacher) {
      // Check password
      const isPasswordValid = await bcrypt.compare(password, teacher.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check if teacher is active
      if (!teacher.status) {
        return res.status(403).json({
          message: "Your account is inactive. Please contact administrator.",
        });
      }

      // Generate JWT token for teacher
      const token = jwt.sign(
        {
          userId: teacher._id,
          email: teacher.email,
          userType: "teacher",
          schoolId: teacher.schoolId._id,
        },
        config.jwtSecret,
        { expiresIn: "7d" },
      );

      // Return success response with token
      return res.status(200).json({
        message: "Login successful",
        token,
        userType: "teacher",
        user: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          phone: teacher.phone,
          designation: teacher.designation,
          school: teacher.schoolId,
        },
      });
    }

    // If neither school nor teacher found
    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get current logged-in user info (school or teacher)
export const getMe = async (req, res) => {
  try {
    // req.user and req.userType are set by the authenticate middleware
    res.status(200).json({
      message: "User retrieved successfully",
      userType: req.userType,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Change password for both school and teacher
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide old and new password" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    let user;
    if (req.userType === "school") {
      user = await School.findById(req.userId);
    } else if (req.userType === "teacher") {
      user = await Teacher.findById(req.userId);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
