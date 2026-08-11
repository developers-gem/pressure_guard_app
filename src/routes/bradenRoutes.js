import { Router } from "express";
import { listForPatient, createAssessment } from "../controllers/bradenController.js";
import { requireAuth } from "../middleware/auth.js";

// nested under /api/patients/:patientId/braden
const router = Router({ mergeParams: true });
router.use(requireAuth);
router.get("/", listForPatient);
router.post("/", createAssessment);

export default router;
