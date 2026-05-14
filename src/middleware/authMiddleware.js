import jwt from "jsonwebtoken";
import config from "../config/config.js";
import School from "../models/academic/SchoolModel.js";
import Teacher from "../models/teacher/TeacherModel.js";

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    let user;
    if (decoded.userType === "school") {
      // Find school by id from token
      user = await School.findById(decoded.userId).select("-password");
      if (!user) {
        return res
          .status(401)
          .json({ message: "School not found, authorization denied" });
      }
    } else if (decoded.userType === "teacher") {
      // Find teacher by id from token
      user = await Teacher.findById(decoded.userId)
        .select("-password")
        .populate("schoolId", "name");
      if (!user) {
        return res
          .status(401)
          .json({ message: "Teacher not found, authorization denied" });
      }
      // Check if teacher is active
      if (!user.status) {
        return res.status(403).json({
          message: "Your account is inactive. Please contact administrator.",
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Invalid user type, authorization denied" });
    }

    // Add user info to request object
    req.user = user;
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    req.userEmail = decoded.email;

    // For backward compatibility (if any code uses req.schoolId)
    if (decoded.userType === "school") {
      req.schoolId = decoded.userId;
      req.school = user;
    } else if (decoded.userType === "teacher") {
      req.teacherId = decoded.userId;
      req.teacher = user;
      req.schoolId = decoded.schoolId;
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token is not valid" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    res.status(500).json({ message: "Server error in authentication" });
  }
};
