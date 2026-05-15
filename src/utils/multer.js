const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");
import CloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "./../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "school-management-system",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
    resource_type: "auto",
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024, // ✅ 100KB limit
  },
});

export default upload;
