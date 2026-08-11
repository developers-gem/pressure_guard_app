import "dotenv/config";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import mongoose from "mongoose";

async function seed() {
  await connectDB();

  const email = "admin@pressureguard.local";
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`[seed] admin user already exists: ${email}`);
  } else {
    const passwordHash = await User.hashPassword("ChangeMe123!");
    await User.create({
      name: "Demo Admin",
      email,
      passwordHash,
      credentials: "RN, BSN",
      role: "admin",
    });
    console.log(`[seed] created admin user → ${email} / ChangeMe123! (change this immediately)`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
