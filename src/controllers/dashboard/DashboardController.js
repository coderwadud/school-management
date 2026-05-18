import Student from "../../models/student/StudentModel.js";
import Teacher from "../../models/teacher/TeacherModel.js";
import Staff from "../../models/staff/StaffModel.js";
import FeeCollection from "../../models/fees/FeeCollectionModel.js";
import Expense from "../../models/fees/ExpenseModel.js";
import Income from "../../models/fees/IncomeModel.js";
import StudentAttendance from "../../models/attendance/StudentAttendanceModel.js";
import TeacherAttendance from "../../models/attendance/TeacherAttendanceModel.js";
import Exam from "../../models/examination/ExamModel.js";
import Book from "../../models/library/BookModel.js";
import BookIssue from "../../models/library/BookIssueModel.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const { schoolId } = req.query;

    // Count statistics
    const totalStudents = await Student.countDocuments({ status: true });
    const totalTeachers = await Teacher.countDocuments({ status: true });
    const totalStaff = await Staff.countDocuments({ status: true });
    const totalBooks = await Book.countDocuments({ status: true });

    // Today's attendance
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayStudentAttendance = await StudentAttendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const todayPresentStudents = await StudentAttendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: "Present",
    });

    const todayAbsentStudents = await StudentAttendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: "Absent",
    });

    // Today's fee collection
    const todayFees = await FeeCollection.aggregate([
      {
        $match: {
          paymentDate: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paidAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Monthly statistics
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    );

    const monthlyIncome = await Income.aggregate([
      {
        $match: {
          date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const monthlyExpense = await Expense.aggregate([
      {
        $match: {
          date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Library statistics
    const issuedBooks = await BookIssue.countDocuments({ status: "Issued" });
    const overdueBooks = await BookIssue.countDocuments({
      status: "Issued",
      dueDate: { $lt: today },
    });

    // Upcoming exams
    const upcomingExams = await Exam.find({
      startDate: { $gte: today },
      status: { $in: ["Scheduled", "Ongoing"] },
    })
      .limit(5)
      .sort({ startDate: 1 })
      .populate("classId", "name")
      .populate("examType", "name");

    res.status(200).json({
      success: true,
      data: {
        users: {
          totalStudents,
          totalTeachers,
          totalStaff,
          totalUsers: totalStudents + totalTeachers + totalStaff,
        },
        attendance: {
          todayTotal: todayStudentAttendance,
          todayPresent: todayPresentStudents,
          todayAbsent: todayAbsentStudents,
          todayPercentage:
            todayStudentAttendance > 0
              ? ((todayPresentStudents / todayStudentAttendance) * 100).toFixed(
                  2,
                )
              : 0,
        },
        fees: {
          todayCollection: todayFees.length > 0 ? todayFees[0].total : 0,
          todayTransactions: todayFees.length > 0 ? todayFees[0].count : 0,
        },
        finance: {
          monthlyIncome: monthlyIncome.length > 0 ? monthlyIncome[0].total : 0,
          monthlyExpense:
            monthlyExpense.length > 0 ? monthlyExpense[0].total : 0,
          monthlyProfit:
            (monthlyIncome.length > 0 ? monthlyIncome[0].total : 0) -
            (monthlyExpense.length > 0 ? monthlyExpense[0].total : 0),
        },
        library: {
          totalBooks,
          issuedBooks,
          overdueBooks,
          availableBooks: totalBooks - issuedBooks,
        },
        exams: {
          upcomingExams,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard statistics",
    });
  }
};

// Get monthly report
export const getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    // Fee collection
    const feeCollection = await FeeCollection.aggregate([
      {
        $match: {
          paymentDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paidAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Expenses
    const expenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Income
    const income = await Income.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Student attendance summary
    const attendanceStats = await StudentAttendance.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: { month, year },
        finance: {
          feeCollection: feeCollection.length > 0 ? feeCollection[0].total : 0,
          totalExpenses: expenses.length > 0 ? expenses[0].total : 0,
          totalIncome: income.length > 0 ? income[0].total : 0,
          netProfit:
            (income.length > 0 ? income[0].total : 0) -
            (expenses.length > 0 ? expenses[0].total : 0),
        },
        attendance: attendanceStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch monthly report",
    });
  }
};
