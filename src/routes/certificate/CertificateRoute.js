import {
  generateCertificate,
  getAllCertificates,
  getCertificateById,
  getCertificateByCertificateNumber,
  verifyCertificate,
  getStudentCertificates,
  generateCharacterCertificate,
  generateBonafideCertificate,
  updateCertificate,
  cancelCertificate,
  deleteCertificate,
} from "../../controllers/certificate/CertificateController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, generateCertificate);
router.get("/", authenticate, getAllCertificates);
router.post("/verify", verifyCertificate); // Public route for verification
router.get("/number/:certificateNumber", getCertificateByCertificateNumber);
router.get("/student/:studentId", authenticate, getStudentCertificates);
router.post(
  "/character/:studentId",
  authenticate,
  generateCharacterCertificate,
);
router.post("/bonafide/:studentId", authenticate, generateBonafideCertificate);
router.get("/:id", authenticate, getCertificateById);
router.put("/:id", authenticate, updateCertificate);
router.patch("/:id/cancel", authenticate, cancelCertificate);
router.delete("/:id", authenticate, deleteCertificate);

export default router;
