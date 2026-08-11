import { Router } from "express";
import { listForPatient, createInspection } from "../controllers/skinInspectionController.js";
import { requireAuth } from "../middleware/auth.js";

// nested under /api/patients/:patientId/skin-inspections
const router = Router({ mergeParams: true });
router.use(requireAuth);
router.get("/", listForPatient);
router.post("/", createInspection);

export default router;
