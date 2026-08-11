import FootAssessment from "../models/FootAssessment.js";
import Patient from "../models/Patient.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// GET /api/patients/:patientId/foot-assessments?limit=10
export const listForPatient = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const assessments = await FootAssessment.find({ patient: req.params.patientId })
    .sort({ timestamp: -1 })
    .limit(limit);
  res.json(assessments);
});

// POST /api/patients/:patientId/foot-assessments
export const createAssessment = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.patientId);
  if (!patient) return res.status(404).json({ error: "Patient not found" });

  const { staff, side, wagnerGrade, size, location, drainage, pulses, sensation, notes, photos } = req.body;
  if (!staff || !staff.trim()) return res.status(400).json({ error: "staff is required" });
  if (!["Left", "Right", "Both"].includes(side)) return res.status(400).json({ error: "Invalid side" });
  if (typeof wagnerGrade !== "number" || wagnerGrade < 0 || wagnerGrade > 5) {
    return res.status(400).json({ error: "wagnerGrade must be 0-5" });
  }

  const assessment = await FootAssessment.create({
    patient: patient._id,
    patientName: patient.name,
    staff: staff.trim(),
    side,
    wagnerGrade,
    size: size || "",
    location: location || "",
    drainage: drainage || "None",
    pulses: pulses || "Palpable",
    sensation: sensation || "Intact (10g monofilament)",
    notes: notes || "",
    photos: photos || [],
    timestamp: new Date(),
    createdBy: req.user._id,
  });

  res.status(201).json(assessment);
});
