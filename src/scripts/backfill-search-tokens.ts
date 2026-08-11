import connectDB from "@/lib/db/mongoose";
import { Mosque } from "@/lib/Model/Mosque";

async function run() {
  await connectDB();
  const mosques = await Mosque.find({});
  for (const mosque of mosques) {
    await mosque.save(); // triggers the pre("save") hook above
  }
  console.log(`Backfilled ${mosques.length} mosques`);
}

run();
