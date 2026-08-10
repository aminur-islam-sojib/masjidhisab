import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";

// Ensures this route is dynamically evaluated on every request
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Attempt to connect (or retrieve cached connection)
    await connectDB();
    
    // Mongoose connection states:
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const state = mongoose.connection.readyState;
    const isHealthy = state === 1;

    const dbStatus = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting",
      99: "Uninitialized",
    }[state] || "Unknown";

    if (!isHealthy) {
      return NextResponse.json(
        { 
          status: "Error", 
          message: "Database is not connected", 
          dbState: dbStatus, 
          timestamp: new Date().toISOString() 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        status: "OK", 
        message: "System is healthy", 
        dbState: dbStatus,
        uptime: process.uptime(),
        timestamp: new Date().toISOString() 
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: "Error", 
        message: "Health check failed", 
        error: error.message, 
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    );
  }
}