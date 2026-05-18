import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    schoolInfo: {
      name: String,
      address: String,
      phone: String,
      email: String,
      website: String,
      established: String,
      logo: String,
      favicon: String,
    },
    systemSettings: {
      timezone: {
        type: String,
        default: "Asia/Dhaka",
      },
      dateFormat: {
        type: String,
        default: "DD/MM/YYYY",
      },
      timeFormat: {
        type: String,
        default: "12",
      },
      currency: {
        type: String,
        default: "BDT",
      },
      currencySymbol: {
        type: String,
        default: "৳",
      },
      language: {
        type: String,
        default: "bn",
      },
    },
    emailConfig: {
      smtpHost: String,
      smtpPort: Number,
      smtpUser: String,
      smtpPassword: String,
      fromEmail: String,
      fromName: String,
    },
    smsConfig: {
      provider: String,
      apiKey: String,
      senderId: String,
    },
    paymentGateway: {
      bkash: {
        enabled: Boolean,
        appKey: String,
        appSecret: String,
      },
      nagad: {
        enabled: Boolean,
        merchantId: String,
        publicKey: String,
      },
      sslcommerz: {
        enabled: Boolean,
        storeId: String,
        storePassword: String,
      },
    },
    appearance: {
      themeName: {
        type: String,
        default: "default",
      },
      primaryColor: {
        type: String,
        default: "#4F46E5",
      },
      secondaryColor: {
        type: String,
        default: "#10B981",
      },
    },
  },
  { timestamps: true },
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
