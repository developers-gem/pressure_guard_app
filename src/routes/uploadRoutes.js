import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { uploadPhoto } from "../controllers/uploadController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.post("/", requireAuth, upload.single("photo"), uploadPhoto);

export default router;
