import Patient from "../models/Patient.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// GET /api/patients?active=true
export const listPatients = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.active !== undefined) filter.active = req.query.active === "true";
  const patients = await Patient.find(filter).sort({ name: 1 });
  res.json(patients.map((p) => p.toJSONSafe()));
});

// GET /api/patients/:id
export const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ error: "Patient not found" });
  res.json(patient.toJSONSafe());
});

// POST /api/patients
export const createPatient = asyncHandler(async (req, res) => {
  const { name, room, mrn } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "Patient name is required" });
  const patient = await Patient.create({
    name: name.trim(),
    room: (room || "—").trim(),
    mrn: (mrn || "").trim(),
    createdBy: req.user._id,
  });
  res.status(201).json(patient.toJSONSafe());
});

// PATCH /api/patients/:id
export const updatePatient = asyncHandler(async (req, res) => {
  const allowed = ["name", "room", "mrn", "active"];
  const updates = {};
  for (const key of allowed) if (key in req.body) updates[key] = req.body[key];

  const patient = await Patient.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!patient) return res.status(404).json({ error: "Patient not found" });
  res.json(patient.toJSONSafe());
});

// DELETE /api/patients/:id
export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);
  if (!patient) return res.status(404).json({ error: "Patient not found" });
  res.status(204).send();
});
