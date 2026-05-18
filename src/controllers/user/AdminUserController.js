import AdminUser from "../../models/user/AdminUserModel.js";
import bcrypt from "bcrypt";

// Create admin user
export const createAdminUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new AdminUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    await adminUser.save();

    // Remove password from response
    const userResponse = adminUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create admin user",
    });
  }
};

// Get all admin users
export const getAllAdminUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, role } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.status = status === "true";
    if (role) query.role = role;

    const users = await AdminUser.find(query)
      .select("-password")
      .populate("role", "name displayName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AdminUser.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admin users",
    });
  }
};

// Get admin user by ID
export const getAdminUserById = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id)
      .select("-password")
      .populate("role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admin user",
    });
  }
};

// Update admin user
export const updateAdminUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    // If password is being updated, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await AdminUser.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .populate("role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin user updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update admin user",
    });
  }
};

// Delete admin user
export const deleteAdminUser = async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete admin user",
    });
  }
};

// Toggle admin user status
export const toggleAdminUserStatus = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    user.status = !user.status;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Admin user status updated successfully",
      data: { status: user.status },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update admin user status",
    });
  }
};
