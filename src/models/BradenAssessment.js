import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema(
  {
    sensory: { type: Number, min: 1, max: 4, required: true },
    moisture: { type: Number, min: 1, max: 4, required: true },
    activity: { type: Number, min: 1, max: 4, required: true },
    mobility: { type: Number, min: 1, max: 4, required: true },
    nutrition: { type: Number, min: 1, max: 4, required: true },
    friction: { type: Number, min: 1, max: 3, required: true },
  },
  { _id: false },
);

const BradenAssessmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    patientName: { type: String, required: true },
    staff: { type: String, required: true, trim: true },
    scores: { type: ScoreSchema, required: true },
    total: { type: Number, required: true, min: 6, max: 23 },
    riskLevel: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("BradenAssessment", BradenAssessmentSchema);
