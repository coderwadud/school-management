import Branch from "../../models/academic/BranchModel.js";
import School from "../../models/academic/SchoolModel.js";
export const createBranch = async (req, res) => {
  try {
    const { name, branchCode, principalName, schoolId, address, status } = req.body;
    // Check if the school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    const newBranch = new Branch({
      name,
      branchCode,
      principalName,
      schoolId,
      address,
      status,
    });
    const savedBranch = await newBranch.save();
    res.status(201).json(savedBranch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().populate("schoolId", "name");
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id).populate("schoolId", "name");
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBranch = async (req, res) => {
  try {    const { name, branchCode, principalName, schoolId, address, status } = req.body;
    // Check if the school exists
    if (schoolId) { 
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
    }
    const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      { name, branchCode, principalName, schoolId, address, status },
      { new: true }
    );
    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(200).json(updatedBranch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const deletedBranch = await Branch.findByIdAndDelete(req.params.id);
    if (!deletedBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleBranchStatus = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    branch.status = !branch.status;
    const updatedBranch = await branch.save();
    res.status(200).json(updatedBranch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBranchesOptions = async (req, res) => {
  try {
    const branches = await Branch.find({ status: true }).select("name _id");
    const options = branches.map((branch) => ({
      label: branch.name,
      value: branch._id,
    }));
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
