import mongoose from "mongoose";
const { Schema } = mongoose;

const salaryPaymentSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    employeeType: {
      type: String,
      enum: ["Teacher", "Staff"],
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "employeeType",
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
    },
    allowances: {
      houseRent: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    deductions: {
      tax: { type: Number, default: 0 },
      providentFund: { type: Number, default: 0 },
      loan: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    totalAllowances: {
      type: Number,
      default: 0,
    },
    totalDeductions: {
      type: Number,
      default: 0,
    },
    netSalary: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Cheque"],
      required: true,
    },
    transactionId: {
      type: String,
    },
    remarks: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Paid",
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true },
);

// Calculate totals before saving
salaryPaymentSchema.pre("save", function (next) {
  this.totalAllowances =
    (this.allowances.houseRent || 0) +
    (this.allowances.medical || 0) +
    (this.allowances.transport || 0) +
    (this.allowances.other || 0);

  this.totalDeductions =
    (this.deductions.tax || 0) +
    (this.deductions.providentFund || 0) +
    (this.deductions.loan || 0) +
    (this.deductions.other || 0);

  this.netSalary =
    this.basicSalary + this.totalAllowances - this.totalDeductions;
  next();
});

const SalaryPayment = mongoose.model("SalaryPayment", salaryPaymentSchema);
export default SalaryPayment;
