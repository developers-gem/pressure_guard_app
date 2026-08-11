import SkinInspection, { SKIN_AREAS, SKIN_STATUSES } from "../models/SkinInspection.js";
import Patient from "../models/Patient.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// GET /api/patients/:patientId/skin-inspections?limit=10
export const listForPatient = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const inspections = await SkinInspection.find({ patient: req.params.patientId })
    .sort({ timestamp: -1 })
    .limit(limit);
  res.json(inspections);
});

// POST /api/patients/:patientId/skin-inspections
// body: { staff, areas: [{ area, status, notes }], photos: [{ url, caption, bodyLocation }] }
export const createInspection = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.patientId);
  if (!patient) return res.status(404).json({ error: "Patient not found" });

  const { staff, areas = [], photos = [] } = req.body;
  if (!staff || !staff.trim()) return res.status(400).json({ error: "staff is required" });

  for (const a of areas) {
    if (!SKIN_AREAS.includes(a.area)) return res.status(400).json({ error: `Invalid area: ${a.area}` });
    if (!SKIN_STATUSES.includes(a.status)) return res.status(400).json({ error: `Invalid status: ${a.status}` });
  }

  const inspection = await SkinInspection.create({
    patient: patient._id,
    patientName: patient.name,
    staff: staff.trim(),
    areas,
    photos,
    timestamp: new Date(),
    createdBy: req.user._id,
  });

  res.status(201).json(inspection);
});
