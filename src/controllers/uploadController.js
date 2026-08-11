import { asyncHandler } from "../middleware/errorHandler.js";

// POST /api/uploads  (multipart/form-data, field name "photo")
export const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded (field name must be 'photo')" });
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url, size: req.file.size, mimetype: req.file.mimetype });
});
