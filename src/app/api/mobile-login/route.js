// app/api/mobile-login/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { busId, password } = await req.json();

    const client = await clientPromise;
    const db = client.db("BusAttendance");

    // CRITICAL: Convert string "2.2" to number 2.2 to match MongoDB type
    const busIdNumber = parseFloat(busId);

    const user = await db.collection("users").findOne({
      busId: busIdNumber,
      password: password, // Must be exact match (case sensitive)
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid Credentials" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        busId: user.busId,
        name: user.name,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 },
    );
  }
}
