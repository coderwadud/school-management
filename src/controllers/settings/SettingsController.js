import Settings from "../../models/settings/SettingsModel.js";

// Get settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings({});
      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch settings",
    });
  }
};

// Update school information
export const updateSchoolInfo = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({});
    }

    settings.schoolInfo = {
      ...settings.schoolInfo,
      ...req.body,
    };

    await settings.save();

    res.status(200).json({
      success: true,
      message: "School information updated successfully",
      data: settings.schoolInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update school information",
    });
  }
};

// Update system settings
export const updateSystemSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({});
    }

    settings.systemSettings = {
      ...settings.systemSettings,
      ...req.body,
    };

    await settings.save();

    res.status(200).json({
      success: true,
      message: "System settings updated successfully",
      data: settings.systemSettings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update system settings",
    });
  }
};

// Update email configuration
export const updateEmailConfig = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({});
    }

    settings.emailConfig = {
      ...settings.emailConfig,
      ...req.body,
    };

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Email configuration updated successfully",
      data: settings.emailConfig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update email configuration",
    });
  }
};

// Update SMS configuration
export const updateSMSConfig = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({});
    }

    settings.smsConfig = {
      ...settings.smsConfig,
      ...req.body,
    };

    await settings.save();

    res.status(200).json({
      success: true,
      message: "SMS configuration updated successfully",
      data: settings.smsConfig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update SMS configuration",
    });
  }
};

// Update payment gateway
export const updatePaymentGateway = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({});
    }

    settings.paymentGateway = {
      ...settings.paymentGateway,
      ...req.body,
    };

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Payment gateway updated successfully",
      data: settings.paymentGateway,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update payment gateway",
    });
  }
};

// Update appearance settings
export const updateAppearance = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({});
    }

    settings.appearance = {
      ...settings.appearance,
      ...req.body,
    };

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Appearance settings updated successfully",
      data: settings.appearance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update appearance settings",
    });
  }
};
