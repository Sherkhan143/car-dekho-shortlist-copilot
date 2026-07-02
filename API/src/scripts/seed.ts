import dotenv from "dotenv";
import { connectDB, disconnectDB } from "../config/db";
import { seedCars } from "../data/seed-cars";

dotenv.config();

/**
 * Standalone seeder. Useful for populating an external/persistent database
 * (set MONGO_URI). Note: the server auto-seeds the in-memory database on
 * startup, so this is only needed when using an external MongoDB.
 */
async function run() {
  try {
    await connectDB();
    const count = await seedCars();
    console.log(`Seeded ${count} cars`);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
    console.log("Disconnected");
  }
}

run();
