import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// CRITICAL: Prevent Next.js from caching this API response
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("BusAttendance");
    
    const stats = await db.collection("members").aggregate([
      {
        $group: {
          _id: "$busId",
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ["$isPresent", true] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}