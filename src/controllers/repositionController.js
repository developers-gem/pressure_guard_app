import RepositionLog, { POSITIONS } from "../models/RepositionLog.js";
import Patient from "../models/Patient.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const REPOSITION_POSITIONS = POSITIONS;

// GET /api/patients/:patientId/repositioning?limit=20
export const listForPatient = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const logs = await RepositionLog.find({ patient: req.params.patientId })
    .sort({ timestamp: -1 })
    .limit(limit);
  res.json(logs);
});

// GET /api/repositioning?since=ISO
export const listAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.since) filter.timestamp = { $gte: new Date(req.query.since) };
  const logs = await RepositionLog.find(filter).sort({ timestamp: -1 });
  res.json(logs);
});

// POST /api/patients/:patientId/repositioning
export const createLog = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.patientId);
  if (!patient) return res.status(404).json({ error: "Patient not found" });

  const { position, staff, notes } = req.body;
  if (!position || !POSITIONS.includes(position)) {
    return res.status(400).json({ error: `position must be one of: ${POSITIONS.join(", ")}` });
  }
  if (!staff || !staff.trim()) return res.status(400).json({ error: "staff is required" });

  const timestamp = new Date();
  const entry = await RepositionLog.create({
    patient: patient._id,
    patientName: patient.name,
    position,
    staff: staff.trim(),
    notes: (notes || "").trim(),
    timestamp,
    createdBy: req.user._id,
  });

  patient.lastRepositioned = timestamp;
  patient.lastPosition = position;
  await patient.save();

  res.status(201).json(entry);
});
