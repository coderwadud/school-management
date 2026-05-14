import School from "../../models/academic/SchoolModel.js";
import bcrypt from "bcrypt";
export const createSchool = async (req, res) => {
  try {
    const { name, schoolCode, logo, email, phone, address, website, password } =
      req.body;

    // Validate password
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSchool = new School({
      name,
      schoolCode,
      logo,
      email,
      password: hashedPassword,
      phone,
      address,
      website,
    });
    const savedSchool = await newSchool.save();

    // Remove password from response
    const schoolResponse = savedSchool.toObject();
    delete schoolResponse.password;

    res.status(201).json(schoolResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSchools = async (req, res) => {
  try {
    const schools = await School.find().select("-password");
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id).select("-password");
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
    const { name, schoolCode, logo, email, phone, address, website, password } =
      req.body;

    const updateData = {
      name,
      schoolCode,
      logo,
      email,
      phone,
      address,
      website,
    };

    // If password is provided, hash it
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedSchool = await School.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    ).select("-password");

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
