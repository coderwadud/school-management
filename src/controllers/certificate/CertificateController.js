import Certificate from "../../models/certificate/CertificateModel.js";
import Student from "../../models/student/StudentModel.js";

// Generate certificate
export const generateCertificate = async (req, res) => {
  try {
    const { studentId, certificateType, purpose, content, issuedBy } = req.body;

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const certificate = new Certificate({
      certificateType,
      studentId,
      purpose,
      content,
      issuedBy,
      academicYear: new Date().getFullYear().toString(),
    });

    await certificate.save();

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate("studentId", "personalInformation academicInformation")
      .populate("issuedBy", "personalInformation");

    res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      data: populatedCertificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate certificate",
    });
  }
};

// Get all certificates
export const getAllCertificates = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      certificateType,
      studentId,
      status,
    } = req.query;

    const query = {};
    if (certificateType) query.certificateType = certificateType;
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;

    const certificates = await Certificate.find(query)
      .populate("studentId", "personalInformation academicInformation")
      .populate("issuedBy", "personalInformation")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Certificate.countDocuments(query);

    res.status(200).json({
      success: true,
      data: certificates,
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
      message: error.message || "Failed to fetch certificates",
    });
  }
};

// Get certificate by ID
export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate(
        "studentId",
        "personalInformation academicInformation guardianInformation",
      )
      .populate("issuedBy", "personalInformation professionalInformation");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch certificate",
    });
  }
};

// Get certificate by certificate number
export const getCertificateByCertificateNumber = async (req, res) => {
  try {
    const { certificateNumber } = req.params;

    const certificate = await Certificate.findOne({ certificateNumber })
      .populate("studentId", "personalInformation academicInformation")
      .populate("issuedBy", "personalInformation");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch certificate",
    });
  }
};

// Verify certificate
export const verifyCertificate = async (req, res) => {
  try {
    const { certificateNumber, verificationCode } = req.body;

    const certificate = await Certificate.findOne({
      certificateNumber,
      verificationCode,
    })
      .populate("studentId", "personalInformation")
      .populate("issuedBy", "personalInformation");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Invalid certificate or verification code",
      });
    }

    if (certificate.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: `Certificate is ${certificate.status.toLowerCase()}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate verified successfully",
      data: {
        certificateNumber: certificate.certificateNumber,
        certificateType: certificate.certificateType,
        studentName: `${certificate.studentId.personalInformation.firstName} ${certificate.studentId.personalInformation.lastName}`,
        issueDate: certificate.issueDate,
        issuedBy: `${certificate.issuedBy.personalInformation.firstName} ${certificate.issuedBy.personalInformation.lastName}`,
        status: certificate.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify certificate",
    });
  }
};

// Get student certificates
export const getStudentCertificates = async (req, res) => {
  try {
    const { studentId } = req.params;

    const certificates = await Certificate.find({ studentId })
      .populate("issuedBy", "personalInformation")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch student certificates",
    });
  }
};

// Generate Character Certificate
export const generateCharacterCertificate = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { issuedBy, purpose } = req.body;

    const student = await Student.findById(studentId)
      .populate("academicInformation.session", "name")
      .populate("academicInformation.studentClass", "name")
      .populate("academicInformation.section", "name");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const content = `This is to certify that ${student.personalInformation.firstName} ${student.personalInformation.lastName}, son/daughter of ${student.guardianInformation.fatherName}, was a bonafide student of ${student.academicInformation.studentClass?.name} (Section: ${student.academicInformation.section?.name}) during the academic year ${student.academicInformation.session?.name}.

During his/her stay in this institution, his/her conduct and character have been found to be good. He/she bears a good moral character.

This certificate is issued on his/her request for ${purpose || "further studies"}.`;

    const certificate = new Certificate({
      certificateType: "Character Certificate",
      studentId,
      purpose,
      content,
      issuedBy,
    });

    await certificate.save();

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate(
        "studentId",
        "personalInformation academicInformation guardianInformation",
      )
      .populate("issuedBy", "personalInformation");

    res.status(201).json({
      success: true,
      message: "Character certificate generated successfully",
      data: populatedCertificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate character certificate",
    });
  }
};

// Generate Bonafide Certificate
export const generateBonafideCertificate = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { issuedBy, purpose } = req.body;

    const student = await Student.findById(studentId)
      .populate("academicInformation.session", "name")
      .populate("academicInformation.studentClass", "name")
      .populate("academicInformation.section", "name");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const content = `This is to certify that ${student.personalInformation.firstName} ${student.personalInformation.lastName}, son/daughter of ${student.guardianInformation.fatherName}, is a bonafide student of this institution studying in ${student.academicInformation.studentClass?.name} (Section: ${student.academicInformation.section?.name}) for the academic year ${student.academicInformation.session?.name}.

Date of Birth: ${new Date(student.personalInformation.dateOfBirth).toLocaleDateString()}

This certificate is issued on his/her request for ${purpose || "official purposes"}.`;

    const certificate = new Certificate({
      certificateType: "Bonafide Certificate",
      studentId,
      purpose,
      content,
      issuedBy,
    });

    await certificate.save();

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate(
        "studentId",
        "personalInformation academicInformation guardianInformation",
      )
      .populate("issuedBy", "personalInformation");

    res.status(201).json({
      success: true,
      message: "Bonafide certificate generated successfully",
      data: populatedCertificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate bonafide certificate",
    });
  }
};

// Update certificate
export const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update certificate",
    });
  }
};

// Cancel certificate
export const cancelCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    certificate.status = "Cancelled";
    await certificate.save();

    res.status(200).json({
      success: true,
      message: "Certificate cancelled successfully",
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel certificate",
    });
  }
};

// Delete certificate
export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete certificate",
    });
  }
};
