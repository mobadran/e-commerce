const validateFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ message: "Invalid file type. Only JPG, PNG, and WEBP are allowed." });
  }

  if (req.file.size > 2 * 1024 * 1024) { // 2MB limit
    return res.status(400).json({ message: "File size must be less than 2MB." });
  }

  next();
};

export default validateFile;