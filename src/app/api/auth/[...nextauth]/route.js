
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
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Bus ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const client = await clientPromise;
          const db = client.db("BusAttendance");
          
          // We use the "admins" collection as per your project requirements
          const adminsCollection = db.collection("admins");
          
          // Using the raw string to match MongoDB Atlas data types
          const busIdInput = credentials.email;

          const admin = await adminsCollection.findOne({ 
            busId: busIdInput,
            password: credentials.password 
          });

          if (admin) {
            // Return the user object for the session
            return {
              id: admin._id.toString(),
              name: admin.name || `Admin ${admin.busId}`,
              busId: admin.busId,
              // Logic: busId "0" is superadmin, others are admin unless specified
              role: admin.role || (admin.busId === "0" ? "superadmin" : "admin"),
              section: admin.section || "General", 
            };
          }
          
          return null; // Login failed
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Transfer data from the user object to the token
      if (user) {
        token.busId = user.busId;
        token.role = user.role;
        token.section = user.section;
      }
      return token;
    },
    async session({ session, token }) {
      // Transfer data from the token to the session object for the frontend
      if (session.user) {
        session.user.busId = token.busId;
        session.user.role = token.role;
        session.user.section = token.section;
      }
      return session;
    },
  },
  pages: { 
    signIn: "/" 
  },
  session: { 
    strategy: "jwt" 
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };