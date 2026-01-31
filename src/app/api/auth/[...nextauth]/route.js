
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import clientPromise from "@/lib/mongodb";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         const client = await clientPromise;
//         const usersCollection = client.db("BusAttendance").collection("users");
        
//         // Find user by email
//         const user = await usersCollection.findOne({ email: credentials.email });

//         // Simple password check (In production, use bcrypt to compare hashed passwords!)
//         if (user && user.password === credentials.password) {
//           return {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             busId: user.busId,
//             section: user.section,
//           };
//         }
//         return null;
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.busId = user.busId;
//         token.section = user.section;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.busId = token.busId;
//       session.user.section = token.section;
//       return session;
//     }
//   },
//   pages: {
//     signIn: "/", // Redirect to home page for login
//   }
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };




// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import clientPromise from "@/lib/mongodb";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         // 'email' here matches the key we send from LoginPage's signIn function
//         email: { label: "Bus ID", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         const client = await clientPromise;
//         const usersCollection = client.db("BusAttendance").collection("users");
        
//         // Convert the string from the dropdown (e.g., "2.2") to a Number (Double)
//         // to match your MongoDB Atlas data type
//         const busIdNumber = parseFloat(credentials.email);

//         // Find user where busId matches the number and password matches exactly
//         const user = await usersCollection.findOne({ 
//           busId: busIdNumber,
//           password: credentials.password 
//         });

//         if (user) {
//           // Map MongoDB fields to NextAuth User object
//           return {
//             id: user._id.toString(),
//             name: user.name,
//             email: user.email, // Kept for NextAuth internal use
//             busId: user.busId,
//             // Section is likely managed by the Admin now, but we keep it in session if needed
//             section: user.section || "Admin", 
//           };
//         }

//         return null;
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.busId = user.busId;
//         token.section = user.section;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.busId = token.busId;
//         session.user.section = token.section;
//       }
//       return session;
//     }
//   },
//   pages: {
//     signIn: "/", // Redirects to your login page
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };



//og
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import clientPromise from "@/lib/mongodb";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Bus ID", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         const client = await clientPromise;
//         const usersCollection = client.db("BusAttendance").collection("users");
        
//         const busIdNumber = parseFloat(credentials.email);

//         const user = await usersCollection.findOne({ 
//           busId: busIdNumber,
//           password: credentials.password 
//         });

//         if (user) {
//           return {
//             id: user._id.toString(),
//             name: user.name,
//             busId: user.busId,
//             role: user.role || "admin", // Passes "superadmin" if role exists in DB
//             section: user.section || "Admin", 
//           };
//         }
//         return null;
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.busId = user.busId;
//         token.role = user.role; // Store role in JWT
//         token.section = user.section;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.busId = token.busId;
//         session.user.role = token.role; // Make role available in frontend
//         session.user.section = token.section;
//       }
//       return session;
//     }
//   },
//   pages: { signIn: "/" },
//   session: { strategy: "jwt" },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };









//ai
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import clientPromise from "../../../../lib/mongodb";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Bus ID", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         try {
//           const client = await clientPromise;
//           const db = client.db("BusAttendance");
          
//           // We use the "admins" collection as per your project requirements
//           const adminsCollection = db.collection("admins");
          
//           // Using the raw string to match MongoDB Atlas data types
//           const busIdInput = credentials.email;

//           const admin = await adminsCollection.findOne({ 
//             busId: busIdInput,
//             password: credentials.password 
//           });

//           if (admin) {
//             // Return the user object for the session
//             return {
//               id: admin._id.toString(),
//               name: admin.name || `Admin ${admin.busId}`,
//               busId: admin.busId,
//               // Logic: busId "0" is superadmin, others are admin unless specified
//               role: admin.role || (admin.busId === "0" ? "superadmin" : "admin"),
//               section: admin.section || "General", 
//             };
//           }
          
//           return null; // Login failed
//         } catch (error) {
//           console.error("Auth error:", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       // Transfer data from the user object to the token
//       if (user) {
//         token.busId = user.busId;
//         token.role = user.role;
//         token.section = user.section;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       // Transfer data from the token to the session object for the frontend
//       if (session.user) {
//         session.user.busId = token.busId;
//         session.user.role = token.role;
//         session.user.section = token.section;
//       }
//       return session;
//     },
//   },
//   pages: { 
//     signIn: "/" 
//   },
//   session: { 
//     strategy: "jwt" 
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };




//api
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import clientPromise from "../../../../lib/mongodb";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Identifier", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         let inputId = credentials.email.trim();
//         const inputPass = credentials.password.trim();

//         try {
//           // 1. MASTER ADMIN CHECK (BusAttendance DB)
//           if (inputId === "master") {
//             const client = await clientPromise;
//             const db = client.db("BusAttendance");
//             const admin = await db.collection("admins").findOne({ busId: "master", password: inputPass });
//             if (admin) return { id: "master", name: "Master Admin", role: "superadmin" };
//           }

//           // 2. ZONE ADMIN CHECK (Data DB -> AdminCredentials)
//           if (inputId.startsWith("Zone")) {
//             console.log("--- ZONE AUTH DEBUG START ---");
//             const client = await clientPromise;
            
//             // Step A: Target the "Data" database from your screenshot
//             const db = client.db("Data"); 

//             // Step B: DEBUG - List collections to verify connection
//             const collections = await db.listCollections().toArray();
//             console.log("Collections found in 'Data' DB:", collections.map(c => c.name));

//             // Step C: Normalization (Matches "Zone 1" to "Zone - 1")
//             let dbZoneName = inputId;
//             if (!dbZoneName.includes("-")) {
//               dbZoneName = dbZoneName.replace("Zone ", "Zone - ");
//             }

//             // Step D: Query the AdminCredentials collection
//             const zoneAdmin = await db.collection("AdminCredentials").findOne({
//               zone: dbZoneName,
//               password: inputPass // Both are strings
//             });

//             if (zoneAdmin) {
//               console.log("✅ MATCH FOUND: ", zoneAdmin.zone);
//               return {
//                 id: zoneAdmin._id.toString(),
//                 name: zoneAdmin.zone,
//                 role: "zoneadmin",
//                 zone: zoneAdmin.zone 
//               };
//             }
//             console.log("❌ NO MATCH in AdminCredentials for:", dbZoneName);
//             console.log("--- ZONE AUTH DEBUG END ---");
//           }

//           // 3. BUS ADMIN CHECK (External API)
//           const apiRes = await fetch("https://bus-traker-backend-82zs.vercel.app/api/buses/login-details");
//           const apiJson = await apiRes.json();

//           if (apiJson.success) {
//             const busMatch = apiJson.data.find(item => {
//               return String(item.busId).trim() === inputId && String(item.password).trim() === inputPass;
//             });

//             if (busMatch) return {
//               id: String(busMatch.busId),
//               name: `Bus ${busMatch.busId}`,
//               busId: String(busMatch.busId),
//               role: "admin",
//               zone: String(busMatch.zone)
//             };
//           }

//           return null;
//         } catch (error) {
//           console.error("Auth System Error:", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//         token.zone = user.zone;
//         token.busId = user.busId;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.role = token.role;
//         session.user.zone = token.zone;
//         session.user.busId = token.busId;
//       }
//       return session;
//     },
//   },
//   pages: { signIn: "/" },
//   session: { strategy: "jwt" },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import clientPromise from "../../../../lib/mongodb";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Identifier", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;
//         let inputId = credentials.email.trim();
//         const inputPass = credentials.password.trim();

//         try {
//           if (inputId === "master") {
//             const client = await clientPromise;
//             const db = client.db("BusAttendance");
//             const admin = await db.collection("admins").findOne({ busId: "master", password: inputPass });
//             if (admin) return { id: "master", name: "Master Admin", role: "superadmin" };
//           }

//           if (inputId.startsWith("Zone")) {
//             const client = await clientPromise;
//             const db = client.db("Data"); 
//             let dbZoneName = inputId.includes("-") ? inputId : inputId.replace("Zone ", "Zone - ");

//             const zoneAdmin = await db.collection("AdminCredentials").findOne({
//               zone: { $regex: new RegExp(`^${dbZoneName.trim()}$`, 'i') },
//               password: inputPass 
//             });

//             if (zoneAdmin) {
//               return {
//                 id: zoneAdmin._id.toString(),
//                 name: zoneAdmin.zone,
//                 role: "zoneadmin",
//                 zone: zoneAdmin.zone 
//               };
//             }
//           }

//           const apiRes = await fetch("https://bus-traker-backend-82zs.vercel.app/api/buses/login-details");
//           const apiJson = await apiRes.json();
//           if (apiJson.success) {
//             const busMatch = apiJson.data.find(item => String(item.busId).trim() === inputId && String(item.password).trim() === inputPass);
//             if (busMatch) return { id: String(busMatch.busId), name: `Bus ${busMatch.busId}`, busId: String(busMatch.busId), role: "admin", zone: String(busMatch.zone) };
//           }
//           return null;
//         } catch (error) { return null; }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) { token.role = user.role; token.zone = user.zone; token.busId = user.busId; }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) { session.user.role = token.role; session.user.zone = token.zone; session.user.busId = token.busId; }
//       return session;
//     },
//   },
//   pages: { signIn: "/" },
//   session: { strategy: "jwt" },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };



// 31jan
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../../lib/mongodb"; // Cluster0 (Zone Auth)
import clientPromiseData from "../../../../lib/mongodb-data"; // Mission92 (Super Admin Auth)

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        let inputId = credentials.email.trim();
        const inputPass = credentials.password.trim();

        try {
          // 1. SUPER ADMIN CHECK (Mission92 Cluster)
          // Password: msm92 | DB: BusAttendance | Collection: admins
          if (inputId === "master") {
            const client = await clientPromiseData;
            const db = client.db("BusAttendance");
            const admin = await db.collection("admins").findOne({ 
              busId: "master", 
              password: inputPass 
            });
            if (admin) return { id: "master", name: "Master Admin", role: "superadmin" };
          }

          // 2. ZONE ADMIN CHECK (Cluster0)
          // DB: Data | Collection: AdminCredentials
          if (inputId.startsWith("Zone")) {
            const client = await clientPromise;
            const db = client.db("Data"); 
            let dbZoneName = inputId.includes("-") ? inputId : inputId.replace("Zone ", "Zone - ");

            const zoneAdmin = await db.collection("AdminCredentials").findOne({
              zone: { $regex: new RegExp(`^${dbZoneName.trim()}$`, 'i') },
              password: inputPass 
            });

            if (zoneAdmin) {
              return {
                id: zoneAdmin._id.toString(),
                name: zoneAdmin.zone,
                role: "zoneadmin",
                zone: zoneAdmin.zone 
              };
            }
          }

          // 3. BUS ADMIN CHECK (External Vercel API)
          const apiRes = await fetch("https://bus-traker-backend-82zs.vercel.app/api/buses/login-details");
          const apiJson = await apiRes.json();
          if (apiJson.success) {
            const busMatch = apiJson.data.find(item => 
              String(item.busId).trim() === inputId && String(item.password).trim() === inputPass
            );
            if (busMatch) return { 
              id: String(busMatch.busId), 
              name: `Bus ${busMatch.busId}`, 
              busId: String(busMatch.busId), 
              role: "admin", 
              zone: String(busMatch.zone) 
            };
          }
          return null;
        } catch (error) { return null; }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { 
        token.role = user.role; 
        token.zone = user.zone; 
        token.busId = user.busId; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { 
        session.user.role = token.role; 
        session.user.zone = token.zone; 
        session.user.busId = token.busId; 
      }
      return session;
    },
  },
  pages: { signIn: "/" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };