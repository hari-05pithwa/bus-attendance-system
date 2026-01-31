// import { NextResponse } from "next/server";
// import clientPromise from "../../../../lib/mongodb";

// export const dynamic = 'force-dynamic';

// export async function GET() {
//   try {
//     const client = await clientPromise;
//     const db = client.db("BusAttendance");
    
//     // Fetch all admins to populate the dropdown
//     const admins = await db.collection("admins").find({}, { projection: { busId: 1, _id: 0 } }).toArray();
    
//     // Return only the busId strings
//     const busList = admins.map(admin => admin.busId);
//     return NextResponse.json(busList);
//   } catch (error) {
//     return NextResponse.json([], { status: 500 });
//   }
// }


//api

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'bus' or 'zone'

  try {
    const url = type === "zone" 
      ? "https://bus-traker-backend-82zs.vercel.app/api/admin/login"
      : "https://bus-traker-backend-82zs.vercel.app/api/buses/login-details";

    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}