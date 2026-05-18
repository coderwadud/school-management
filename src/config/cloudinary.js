import cloudinary from "cloudinary";
import config from "./config.js";

cloudinary.v2.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Helper function to upload files to Cloudinary
export const uploadToCloudinary = async (
  filePath,
  folder = "school-management",
) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: folder,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export default cloudinary.v2;
