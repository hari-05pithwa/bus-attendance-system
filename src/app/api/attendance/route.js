// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";

// // GET members based on busId and gender
// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const busId = searchParams.get("busId");
//   const gender = searchParams.get("gender");

//   try {
//     const client = await clientPromise;
//     const db = client.db("BusAttendance");
//     const members = await db.collection("members")
//       .find({ busId, gender })
//       .toArray();

//     return NextResponse.json(members);
//   } catch (e) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// // PATCH to update attendance (Single or Multiple)
// export async function PATCH(request) {
//   try {
//     const { ids, isPresent } = await request.json(); // ids is an array
//     const client = await clientPromise;
//     const db = client.db("BusAttendance");

//     await db.collection("members").updateMany(
//       { id: { $in: ids } },
//       { $set: { isPresent } }
//     );

//     return NextResponse.json({ success: true });
//   } catch (e) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const busIdRaw = searchParams.get("busId"); // This will be "2.2"

    if (!busIdRaw) return NextResponse.json([]);

    const client = await clientPromise;
    const db = client.db("BusAttendance");
    
    // We search for both number and string types to be 100% safe
    const members = await db.collection("members")
      .find({ 
        $or: [
          { busId: Number(busIdRaw) },
          { busId: busIdRaw }
        ]
      })
      .toArray();
    
    console.log(`API Found ${members.length} members for Bus ID: ${busIdRaw}`);
    
    return NextResponse.json(members || []);

  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json([]);
  }
}

export async function PATCH(request) {
  try {
    const { ids, isPresent } = await request.json();
    const client = await clientPromise;
    const db = client.db("BusAttendance");

    await db.collection("members").updateMany(
      { id: { $in: ids } },
      { $set: { isPresent } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}