import multer from "multer";

// Multer configuration for handling image uploads, using memory storage and setting file size limits

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
