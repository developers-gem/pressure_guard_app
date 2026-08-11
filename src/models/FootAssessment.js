import mongoose from "mongoose";
import { WoundPhotoSchema } from "./WoundPhotoSchema.js";

export const WAGNER_GRADES = [0, 1, 2, 3, 4, 5];
export const DRAINAGE_OPTIONS = ["None", "Serous", "Serosanguinous", "Sanguinous", "Purulent"];
export const PULSE_OPTIONS = ["Palpable", "Diminished", "Doppler only", "Absent"];
export const SENSATION_OPTIONS = ["Intact (10g monofilament)", "Reduced", "Absent — high risk"];

const FootAssessmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    patientName: { type: String, required: true },
    staff: { type: String, required: true, trim: true },
    side: { type: String, enum: ["Left", "Right", "Both"], required: true },
    wagnerGrade: { type: Number, enum: WAGNER_GRADES, required: true },
    size: { type: String, trim: true, default: "" }, // "L × W × D cm"
    location: { type: String, trim: true, default: "" },
    drainage: { type: String, enum: DRAINAGE_OPTIONS, default: "None" },
    pulses: { type: String, enum: PULSE_OPTIONS, default: "Palpable" },
    sensation: { type: String, enum: SENSATION_OPTIONS, default: "Intact (10g monofilament)" },
    notes: { type: String, trim: true, default: "" },
    photos: { type: [WoundPhotoSchema], default: [] },
    timestamp: { type: Date, default: Date.now, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("FootAssessment", FootAssessmentSchema);
