// scripts/backfill-is-active.ts
import connectDB from "@/lib/mongoose";
import { Family } from "@/lib/db/Model/Family";

async function run() {
  await connectDB();
  const result = await Family.updateMany(
    { isActive: { $exists: false } },
    { $set: { isActive: true } }
  );
  console.log(`Updated ${result.modifiedCount} families`);
}

run();