const multer = require("multer");

// ✅ Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

// ✅ Accept only images (JPG, JPEG, PNG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only JPG, JPEG, and PNG formats are allowed."));
  }
};

// ✅ Limit file size (5MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
