// app/api/mobile-login/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { busId, password } = await req.json();

    const client = await clientPromise;
    const db = client.db("BusAttendance");

    // CRITICAL: NextAuth uses float/number for busId in your DB
    const busIdNumber = parseFloat(busId);

    const user = await db.collection("users").findOne({
      busId: busIdNumber,
      password: password, // Matches your vehicle number
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid ID or Vehicle Number" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        busId: user.busId,
        name: user.name,
        role: user.role || "admin",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 },
    );
  }
}
