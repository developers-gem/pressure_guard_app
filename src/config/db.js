import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/pressureguard";
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri);
    console.log(`[db] connected → ${uri}`);
  } catch (err) {
    console.error("[db] connection error:", err.message);
    process.exit(1);
  }
}
