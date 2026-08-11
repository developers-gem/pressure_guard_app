import mongoose from "mongoose";

export const POSITIONS = [
  "Supine",
  "Left lateral (30°)",
  "Right lateral (30°)",
  "Fowler's",
  "Prone",
  "Chair — off-loaded",
];

const RepositionLogSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    patientName: { type: String, required: true }, // denormalized for fast reports
    position: { type: String, enum: POSITIONS, required: true },
    staff: { type: String, required: true, trim: true },
    notes: { type: String, trim: true, default: "" },
    timestamp: { type: Date, default: Date.now, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("RepositionLog", RepositionLogSchema);
