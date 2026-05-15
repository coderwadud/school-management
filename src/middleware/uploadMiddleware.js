import upload from "../utils/multer.js";

const fieldsUpload = (fieldsName = []) => {
  return upload.fields(fieldsName);
};

export { fieldsUpload };
