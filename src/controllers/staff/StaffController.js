import Staff from "../../models/staff/StaffModel.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";

// Create staff
export const createStaff = async (req, res) => {
  try {
    const staffData = req.body;

    // Upload image if provided
    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      const imageUrl = await uploadToCloudinary(imageFile.path);
      staffData.image = imageUrl;
    }

    const staff = new Staff(staffData);
    await staff.save();

    const staffResponse = staff.toObject();
    delete staffResponse.password;

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: staffResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create staff",
    });
  }
};

// Get all staff
export const getAllStaff = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      designation,
      department,
      status,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (designation) query.designation = designation;
    if (department) query.department = department;
    if (status !== undefined) query.status = status === "true";

    const staff = await Staff.find(query)
      .select("-password")
      .populate("schoolId", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Staff.countDocuments(query);

    res.status(200).json({
      success: true,
      data: staff,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch staff",
    });
  }
};

// Get staff by ID
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .select("-password")
      .populate("schoolId", "name");

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch staff",
    });
  }
};

// Update staff
export const updateStaff = async (req, res) => {
  try {
    const updateData = req.body;

    // Upload new image if provided
    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      const imageUrl = await uploadToCloudinary(imageFile.path);
      updateData.image = imageUrl;
    }

    // Don't update password through this endpoint
    delete updateData.password;

    const staff = await Staff.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update staff",
    });
  }
};

// Delete staff
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete staff",
    });
  }
};

// Toggle staff status
export const toggleStaffStatus = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    staff.status = !staff.status;
    await staff.save();

    res.status(200).json({
      success: true,
      message: `Staff ${staff.status ? "activated" : "deactivated"} successfully`,
      data: { status: staff.status },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update staff status",
    });
  }
};

// Get staff options (for dropdowns)
export const getStaffOptions = async (req, res) => {
  try {
    const staff = await Staff.find({ status: true })
      .select("_id name designation department")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch staff options",
    });
  }
};
