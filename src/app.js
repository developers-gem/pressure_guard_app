import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import repositionRoutes, { nestedRouter as repositionNested } from "./routes/repositionRoutes.js";
import bradenRoutes from "./routes/bradenRoutes.js";
import skinInspectionRoutes from "./routes/skinInspectionRoutes.js";
import footAssessmentRoutes from "./routes/footAssessmentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import complianceRoutes from "./routes/complianceRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Basic rate limiting to slow brute-force / abuse. Tighten further in prod.
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 600,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Static file serving for uploaded wound photos.
app.use("/uploads", express.static(path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads")));

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", service: "PressureGuard Care API", time: new Date().toISOString() }),
);

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/patients/:patientId/repositioning", repositionNested);
app.use("/api/patients/:patientId/braden", bradenRoutes);
app.use("/api/patients/:patientId/skin-inspections", skinInspectionRoutes);
app.use("/api/patients/:patientId/foot-assessments", footAssessmentRoutes);
app.use("/api/repositioning",repositionRoutes);
app.use("/api/uploads",uploadRoutes);
app.use("/api/compliance",complianceRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
