import {
  getSettings,
  updateSchoolInfo,
  updateSystemSettings,
  updateEmailConfig,
  updateSMSConfig,
  updatePaymentGateway,
  updateAppearance,
} from "../../controllers/settings/SettingsController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getSettings);
router.put("/school-info", authenticate, updateSchoolInfo);
router.put("/system", authenticate, updateSystemSettings);
router.put("/email", authenticate, updateEmailConfig);
router.put("/sms", authenticate, updateSMSConfig);
router.put("/payment-gateway", authenticate, updatePaymentGateway);
router.put("/appearance", authenticate, updateAppearance);

export default router;
