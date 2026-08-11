import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] PressureGuard Care API listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("[server] fatal startup error:", err);
  process.exit(1);
});
