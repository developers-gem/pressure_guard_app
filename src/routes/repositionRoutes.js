import { Router } from "express";
import { listForPatient, listAll, createLog, REPOSITION_POSITIONS } from "../controllers/repositionController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// nested under /api/patients/:patientId/repositioning
export const nestedRouter = Router({ mergeParams: true });
nestedRouter.use(requireAuth);
nestedRouter.get("/", listForPatient);
nestedRouter.post("/", createLog);

// flat /api/repositioning
router.get("/", listAll);
router.get("/positions", (req, res) => res.json(REPOSITION_POSITIONS));

export default router;
