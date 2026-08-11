import mongoose from "mongoose";
import { WoundPhotoSchema } from "./WoundPhotoSchema.js";

export const SKIN_AREAS = [
  "Sacrum / Coccyx",
  "Left heel",
  "Right heel",
  "Left hip / trochanter",
  "Right hip / trochanter",
  "Shoulder blades",
  "Back of head (occiput)",
  "Left elbow",
  "Right elbow",
  "Left ankle (malleolus)",
  "Right ankle (malleolus)",
  "Ears",
];

export const SKIN_STATUSES = [
  "intact",
  "stage1",
  "stage2",
  "stage3",
  "stage4",
  "dti",
  "unstageable",
];

const AreaFindingSchema = new mongoose.Schema(
  {
    area: { type: String, required: true, enum: SKIN_AREAS },
    status: { type: String, enum: SKIN_STATUSES, required: true },
    notes: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const SkinInspectionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    patientName: { type: String, required: true },
    staff: { type: String, required: true, trim: true },
    areas: { type: [AreaFindingSchema], default: [] },
    photos: { type: [WoundPhotoSchema], default: [] },
    timestamp: { type: Date, default: Date.now, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("SkinInspection", SkinInspectionSchema);
