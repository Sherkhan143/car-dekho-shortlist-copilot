import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { seedCars } from "../data/seed-cars";

let memoryServer: MongoMemoryServer | null = null;

/**
 * Connects Mongoose to a database.
 *
 * - If MONGO_URI is set, connects to that external database (e.g. Atlas) and
 *   leaves its data untouched.
 * - Otherwise, spins up an ephemeral in-memory MongoDB and seeds it, so the
 *   project runs out-of-the-box without any credentials. Ideal for reviewers.
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;

  if (uri) {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB (external)");
    return;
  }

  console.log("No MONGO_URI set — starting in-memory MongoDB...");
  memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri());
  console.log("Connected to in-memory MongoDB");

  const count = await seedCars();
  console.log(`Seeded ${count} cars into the in-memory database`);
}

/** Cleanly closes the connection and stops the in-memory server if running. */
export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
