import SalaryPayment from "../../models/salary/SalaryPaymentModel.js";
import Teacher from "../../models/teacher/TeacherModel.js";
import Staff from "../../models/staff/StaffModel.js";

// Pay salary
export const paySalary = async (req, res) => {
  try {
    const salaryData = req.body;
    salaryData.paidBy = req.user._id;

    const salary = new SalaryPayment(salaryData);
    await salary.save();

    const populatedSalary = await SalaryPayment.findById(salary._id)
      .populate("employeeId", "name email designation")
      .populate("paidBy", "name");

    res.status(201).json({
      success: true,
      message: "Salary paid successfully",
      data: populatedSalary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to pay salary",
    });
  }
};

// Get all salary payments
export const getAllSalaryPayments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      employeeType,
      month,
      year,
      status,
    } = req.query;

    const query = {};
    if (employeeType) query.employeeType = employeeType;
    if (month) query.month = month;
    if (year) query.year = parseInt(year);
    if (status) query.status = status;

    const salaries = await SalaryPayment.find(query)
      .populate("employeeId", "name email designation")
      .populate("paidBy", "name")
      .sort({ paymentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await SalaryPayment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: salaries,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch salary payments",
    });
  }
};

// Get salary payment by ID
export const getSalaryPaymentById = async (req, res) => {
  try {
    const salary = await SalaryPayment.findById(req.params.id)
      .populate("employeeId", "name email designation")
      .populate("paidBy", "name");

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: salary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch salary payment",
    });
  }
};

// Get employee salary history
export const getEmployeeSalaryHistory = async (req, res) => {
  try {
    const { employeeId, employeeType } = req.params;

    const salaries = await SalaryPayment.find({
      employeeId,
      employeeType,
    }).sort({ paymentDate: -1 });

    const totalPaid = salaries.reduce((sum, s) => sum + s.netSalary, 0);

    res.status(200).json({
      success: true,
      data: salaries,
      summary: {
        totalPaid,
        totalPayments: salaries.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch salary history",
    });
  }
};

// Get pending salaries
export const getPendingSalaries = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Get all teachers and staff
    const teachers = await Teacher.find({ status: true }).select("name salary");
    const staff = await Staff.find({ status: true }).select("name salary");

    const pendingList = [];

    // Check teachers
    for (const teacher of teachers) {
      const paid = await SalaryPayment.findOne({
        employeeId: teacher._id,
        employeeType: "Teacher",
        month,
        year: parseInt(year),
      });

      if (!paid) {
        pendingList.push({
          employeeId: teacher._id,
          employeeName: teacher.name,
          employeeType: "Teacher",
          salary: teacher.salary,
          status: "Pending",
        });
      }
    }

    // Check staff
    for (const staffMember of staff) {
      const paid = await SalaryPayment.findOne({
        employeeId: staffMember._id,
        employeeType: "Staff",
        month,
        year: parseInt(year),
      });

      if (!paid) {
        pendingList.push({
          employeeId: staffMember._id,
          employeeName: staffMember.name,
          employeeType: "Staff",
          salary: staffMember.salary,
          status: "Pending",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: pendingList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch pending salaries",
    });
  }
};

// Update salary payment
export const updateSalaryPayment = async (req, res) => {
  try {
    const salary = await SalaryPayment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Salary payment updated successfully",
      data: salary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update salary payment",
    });
  }
};

// Delete salary payment
export const deleteSalaryPayment = async (req, res) => {
  try {
    const salary = await SalaryPayment.findByIdAndDelete(req.params.id);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Salary payment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete salary payment",
    });
  }
};
