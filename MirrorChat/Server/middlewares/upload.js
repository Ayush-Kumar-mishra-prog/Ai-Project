import multer from "multer";

// Multer configuration for handling file uploads, using memory storage and setting file size limits

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default upload;
