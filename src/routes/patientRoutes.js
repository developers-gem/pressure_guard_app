import { Router } from "express";
import {
  listPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", listPatients);
router.post("/", createPatient);
router.get("/:id", getPatient);
router.patch("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
