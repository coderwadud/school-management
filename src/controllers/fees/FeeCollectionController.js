import FeeCollection from "../../models/fees/FeeCollectionModel.js";
import Student from "../../models/student/StudentModel.js";

// Collect fee
export const collectFee = async (req, res) => {
  try {
    const feeData = req.body;
    feeData.collectedBy = req.user._id;

    // Generate receipt number
    const count = await FeeCollection.countDocuments();
    feeData.receiptNo = `REC${Date.now()}${count + 1}`;

    // Determine status
    if (feeData.paidAmount >= feeData.amount - feeData.discount) {
      feeData.status = "Paid";
    } else if (feeData.paidAmount > 0) {
      feeData.status = "Partial";
    } else {
      feeData.status = "Due";
    }

    const feeCollection = new FeeCollection(feeData);
    await feeCollection.save();

    const populatedFee = await FeeCollection.findById(feeCollection._id)
      .populate("studentId", "personalInformation")
      .populate("feeType", "name")
      .populate("collectedBy", "name");

    res.status(201).json({
      success: true,
      message: "Fee collected successfully",
      data: populatedFee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to collect fee",
    });
  }
};

// Get all fee collections
export const getAllFeeCollections = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      studentId,
      feeType,
      status,
      startDate,
      endDate,
      month,
      year,
    } = req.query;

    const query = {};

    if (studentId) query.studentId = studentId;
    if (feeType) query.feeType = feeType;
    if (status) query.status = status;
    if (month) query.month = month;
    if (year) query.year = parseInt(year);

    if (startDate && endDate) {
      query.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const feeCollections = await FeeCollection.find(query)
      .populate("studentId", "personalInformation")
      .populate("feeType", "name")
      .populate("collectedBy", "name")
      .sort({ paymentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await FeeCollection.countDocuments(query);

    res.status(200).json({
      success: true,
      data: feeCollections,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch fee collections",
    });
  }
};

// Get fee collection by ID
export const getFeeCollectionById = async (req, res) => {
  try {
    const feeCollection = await FeeCollection.findById(req.params.id)
      .populate("studentId", "personalInformation")
      .populate("feeType", "name")
      .populate("collectedBy", "name");

    if (!feeCollection) {
      return res.status(404).json({
        success: false,
        message: "Fee collection not found",
      });
    }

    res.status(200).json({
      success: true,
      data: feeCollection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch fee collection",
    });
  }
};

// Get student fee history
export const getStudentFeeHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    const feeHistory = await FeeCollection.find({ studentId })
      .populate("feeType", "name")
      .populate("collectedBy", "name")
      .sort({ paymentDate: -1 });

    // Calculate totals
    const totalPaid = feeHistory.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const totalDiscount = feeHistory.reduce(
      (sum, fee) => sum + fee.discount,
      0,
    );
    const totalFine = feeHistory.reduce((sum, fee) => sum + fee.fine, 0);

    res.status(200).json({
      success: true,
      data: feeHistory,
      summary: {
        totalPaid,
        totalDiscount,
        totalFine,
        totalTransactions: feeHistory.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch fee history",
    });
  }
};

// Get due fees report
export const getDueFees = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;

    // Get all students
    const studentQuery = { status: true };
    if (classId) studentQuery["academicInformation.studentClass"] = classId;
    if (sectionId) studentQuery["academicInformation.section"] = sectionId;

    const students = await Student.find(studentQuery).select(
      "personalInformation academicInformation",
    );

    const dueFeesList = [];

    for (const student of students) {
      const paidFees = await FeeCollection.find({ studentId: student._id });
      const totalPaid = paidFees.reduce((sum, fee) => sum + fee.paidAmount, 0);

      // You can add logic to calculate expected fees based on fee structure
      dueFeesList.push({
        studentId: student._id,
        studentName: `${student.personalInformation.firstName} ${student.personalInformation.lastName}`,
        totalPaid,
        // Add more calculations as needed
      });
    }

    res.status(200).json({
      success: true,
      data: dueFeesList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch due fees",
    });
  }
};

// Get daily collection report
export const getDailyCollection = async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    const collections = await FeeCollection.find({
      paymentDate: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("studentId", "personalInformation")
      .populate("feeType", "name")
      .populate("collectedBy", "name");

    const totalAmount = collections.reduce(
      (sum, fee) => sum + fee.paidAmount,
      0,
    );
    const totalDiscount = collections.reduce(
      (sum, fee) => sum + fee.discount,
      0,
    );
    const totalFine = collections.reduce((sum, fee) => sum + fee.fine, 0);

    res.status(200).json({
      success: true,
      data: collections,
      summary: {
        totalCollections: collections.length,
        totalAmount,
        totalDiscount,
        totalFine,
        netCollection: totalAmount + totalFine - totalDiscount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch daily collection",
    });
  }
};

// Delete fee collection
export const deleteFeeCollection = async (req, res) => {
  try {
    const feeCollection = await FeeCollection.findByIdAndDelete(req.params.id);

    if (!feeCollection) {
      return res.status(404).json({
        success: false,
        message: "Fee collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee collection deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete fee collection",
    });
  }
};
