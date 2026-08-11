import BradenAssessment from "../models/BradenAssessment.js";
import Patient from "../models/Patient.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const CATEGORY_KEYS = ["sensory", "moisture", "activity", "mobility", "nutrition", "friction"];

export function riskLevel(total) {
  if (total >= 19) return { level: "No risk", guidance: "Continue routine skin care and daily inspection." };
  if (total >= 15) return { level: "Mild risk", guidance: "Reposition q2h, moisture management, heel protection." };
  if (total >= 13)
    return { level: "Moderate risk", guidance: "Reposition q2h with 30° lateral, pressure-redistribution surface." };
  if (total >= 10)
    return { level: "High risk", guidance: "Aggressive turning schedule, specialty mattress, nutrition consult." };
  return {
    level: "Very high risk",
    guidance: "Full pressure redistribution, dietician + wound care consult, q1-2h turns.",
  };
}

// GET /api/patients/:patientId/braden
export const listForPatient = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const assessments = await BradenAssessment.find({ patient: req.params.patientId })
    .sort({ timestamp: -1 })
    .limit(limit);
  res.json(assessments);
});

// POST /api/patients/:patientId/braden
export const createAssessment = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.patientId);
  if (!patient) return res.status(404).json({ error: "Patient not found" });

  const { scores, staff } = req.body;
  if (!staff || !staff.trim()) return res.status(400).json({ error: "staff is required" });
  if (!scores) return res.status(400).json({ error: "scores object is required" });
  for (const key of CATEGORY_KEYS) {
    if (typeof scores[key] !== "number") {
      return res.status(400).json({ error: `scores.${key} is required and must be a number` });
    }
  }

  const total = CATEGORY_KEYS.reduce((sum, key) => sum + scores[key], 0);
  const { level } = riskLevel(total);

  const assessment = await BradenAssessment.create({
    patient: patient._id,
    patientName: patient.name,
    staff: staff.trim(),
    scores,
    total,
    riskLevel: level,
    timestamp: new Date(),
    createdBy: req.user._id,
  });

  patient.bradenScore = total;
  patient.bradenRisk = level;
  await patient.save();

  res.status(201).json(assessment);
});
