// lib/queries/mosque.ts
import connectDB from "@/lib/db/mongoose";
import { Mosque } from "@/lib/Model/Mosque"; // Adjust this import path to match where your Mosque model is saved

export async function getMosqueDetails(mosqueId: string) {
  try {
    await connectDB();

    // Fetch the mosque by its ID
    // .lean() strips away Mongoose methods and returns a plain JS object
    const mosqueData = await Mosque.findById(mosqueId).lean();

    if (!mosqueData) {
      return null;
    }

    // CRITICAL: Next.js requires props passed to Client Components to be fully serializable.
    // This safely converts MongoDB ObjectIds and Dates into standard strings.
    return JSON.parse(JSON.stringify(mosqueData));
    
  } catch (error) {
    console.error("🔴 ERROR FETCHING MOSQUE DETAILS:", error);
    return null;
  }
}