import express from "express";
import dotenv from "dotenv";
import carRoutes from "./src/routes/car.routes";
import shortlistRoutes from "./src/routes/shortlist.routes";
import { connectDB, disconnectDB } from "./src/config/db";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use("/api/cars", carRoutes);
app.use("/api/shortlist", shortlistRoutes);

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Car Dekho Shortlist Copilot API" });
});

async function start() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Gracefully tear down the DB (and in-memory server) on shutdown.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await disconnectDB();
    process.exit(0);
  });
}

start();
