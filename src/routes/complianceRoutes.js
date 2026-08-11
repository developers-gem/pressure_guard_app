import { Router } from "express";
import { summary, exportCSV } from "../controllers/complianceController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.get("/summary", summary);
router.get("/export.csv", exportCSV);

export default router;
