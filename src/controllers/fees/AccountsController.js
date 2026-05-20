import Expense from "../../models/fees/ExpenseModel.js";
import Income from "../../models/fees/IncomeModel.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";

// Add expense
export const addExpense = async (req, res) => {
  try {
    const expenseData = req.body;
    expenseData.addedBy = req.user._id;

    // Upload attachments if provided
    if (req.files && req.files.attachments) {
      const attachments = [];
      for (const file of req.files.attachments) {
        const url = await uploadToCloudinary(file.path);
        attachments.push(url);
      }
      expenseData.attachments = attachments;
    }

    const expense = new Expense(expenseData);
    await expense.save();

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add expense",
    });
  }
};

// Get all expenses
export const getAllExpenses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      startDate,
      endDate,
      month,
      year,
    } = req.query;

    const query = {};

    if (category) query.category = category;

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.date = { $gte: start, $lte: end };
    }

    const expenses = await Expense.find(query)
      .populate("addedBy", "name")
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Expense.countDocuments(query);

    const totalAmount = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      success: true,
      data: expenses,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch expenses",
    });
  }
};

// Get expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate(
      "addedBy",
      "name",
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch expense",
    });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update expense",
    });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete expense",
    });
  }
};

// Add income
export const addIncome = async (req, res) => {
  try {
    const incomeData = req.body;
    incomeData.addedBy = req.user._id;

    const income = new Income(incomeData);
    await income.save();

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      data: income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add income",
    });
  }
};

// Get all incomes
export const getAllIncomes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      startDate,
      endDate,
      month,
      year,
    } = req.query;

    const query = {};

    if (category) query.category = category;

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.date = { $gte: start, $lte: end };
    }

    const incomes = await Income.find(query)
      .populate("addedBy", "name")
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Income.countDocuments(query);

    const totalAmount = await Income.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      success: true,
      data: incomes,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch incomes",
    });
  }
};

// Delete income
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete income",
    });
  }
};

// Get financial summary
export const getFinancialSummary = async (req, res) => {
  try {
    const { startDate, endDate, month, year } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.date = { $gte: start, $lte: end };
    }

    const totalIncome = await Income.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const incomeAmount = totalIncome.length > 0 ? totalIncome[0].total : 0;
    const expenseAmount = totalExpense.length > 0 ? totalExpense[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalIncome: incomeAmount,
        totalExpense: expenseAmount,
        netProfit: incomeAmount - expenseAmount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch financial summary",
    });
  }
};
