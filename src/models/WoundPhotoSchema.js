import mongoose from "mongoose";

// Photos are uploaded via POST /api/uploads (multer) which returns a URL.
// We only ever store the URL + metadata here — never base64 blobs — to keep
// documents small and let the file live on disk / object storage.
export const WoundPhotoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, trim: true, default: "" },
    bodyLocation: { type: String, trim: true, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true },
);
