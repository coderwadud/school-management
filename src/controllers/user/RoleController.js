import Role from "../../models/user/RoleModel.js";

// Create role
export const createRole = async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create role",
    });
  }
};

// Get all roles
export const getAllRoles = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) query.status = status === "true";

    const roles = await Role.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch roles",
    });
  }
};

// Get role by ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch role",
    });
  }
};

// Update role
export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update role",
    });
  }
};

// Delete role
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete role",
    });
  }
};

// Assign permissions to role
export const assignPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { permissions },
      { new: true, runValidators: true },
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Permissions assigned successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to assign permissions",
    });
  }
};
