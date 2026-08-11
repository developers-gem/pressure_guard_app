import Patient from "../models/Patient.js";
import RepositionLog from "../models/RepositionLog.js";
import SkinInspection from "../models/SkinInspection.js";
import FootAssessment from "../models/FootAssessment.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const EXPECTED_TURNS_PER_24H = 12; // q2h

// GET /api/compliance/summary
export const summary = asyncHandler(async (req, res) => {
  const now = Date.now();
  const last24h = new Date(now - 24 * 60 * 60 * 1000);
  const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const [patients, turns24h, inspectionsWeek] = await Promise.all([
    Patient.find({ active: true }),
    RepositionLog.find({ timestamp: { $gte: last24h } }),
    SkinInspection.find({ timestamp: { $gte: last7d } }),
  ]);

  const complianceByPatient = patients.map((p) => {
    const patientTurns = turns24h.filter((l) => String(l.patient) === String(p._id)).length;
    const pct = Math.min(100, Math.round((patientTurns / EXPECTED_TURNS_PER_24H) * 100));
    return { patientId: p._id, name: p.name, room: p.room, turns: patientTurns, pct };
  });

  const overallCompliance = complianceByPatient.length
    ? Math.round(complianceByPatient.reduce((s, r) => s + r.pct, 0) / complianceByPatient.length)
    : 0;

  const overdue = patients
    .filter((p) => p.lastRepositioned && now - new Date(p.lastRepositioned).getTime() > TWO_HOURS_MS)
    .map((p) => ({
      patientId: p._id,
      name: p.name,
      room: p.room,
      minutesSinceLastTurn: Math.floor((now - new Date(p.lastRepositioned).getTime()) / 60000),
    }));

  const highRisk = patients
    .filter((p) => p.bradenScore !== undefined && p.bradenScore !== null && p.bradenScore <= 14)
    .map((p) => ({ patientId: p._id, name: p.name, room: p.room, bradenScore: p.bradenScore, bradenRisk: p.bradenRisk }));

  res.json({
    patientsTracked: patients.length,
    turnsLogged24h: turns24h.length,
    overallCompliance24h: overallCompliance,
    skinInspections7d: inspectionsWeek.length,
    complianceByPatient,
    overdue,
    highRisk,
  });
});

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

// GET /api/compliance/export.csv
export const exportCSV = asyncHandler(async (req, res) => {
  const [logs, inspections, assessments] = await Promise.all([
    RepositionLog.find().sort({ timestamp: -1 }),
    SkinInspection.find().sort({ timestamp: -1 }),
    FootAssessment.find().sort({ timestamp: -1 }),
  ]);

  const rows = [["Type", "Timestamp", "Patient", "Staff", "Detail"]];

  for (const l of logs) {
    rows.push(["Reposition", l.timestamp.toISOString(), l.patientName, l.staff, `${l.position}${l.notes ? " — " + l.notes : ""}`]);
  }
  for (const i of inspections) {
    const issues = i.areas.filter((a) => a.status && a.status !== "intact").length;
    rows.push(["Skin inspection", i.timestamp.toISOString(), i.patientName, i.staff, `${issues} finding(s)`]);
  }
  for (const a of assessments) {
    rows.push(["Foot assessment", a.timestamp.toISOString(), a.patientName, a.staff, `${a.side} · Wagner ${a.wagnerGrade} · ${a.location}`]);
  }

  const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="pressureguard-report-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
});
