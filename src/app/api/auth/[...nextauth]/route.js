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




import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // 'email' here matches the key we send from LoginPage's signIn function
        email: { label: "Bus ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const client = await clientPromise;
        const usersCollection = client.db("BusAttendance").collection("users");
        
        // Convert the string from the dropdown (e.g., "2.2") to a Number (Double)
        // to match your MongoDB Atlas data type
        const busIdNumber = parseFloat(credentials.email);

        // Find user where busId matches the number and password matches exactly
        const user = await usersCollection.findOne({ 
          busId: busIdNumber,
          password: credentials.password 
        });

        if (user) {
          // Map MongoDB fields to NextAuth User object
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email, // Kept for NextAuth internal use
            busId: user.busId,
            // Section is likely managed by the Admin now, but we keep it in session if needed
            section: user.section || "Admin", 
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.busId = user.busId;
        token.section = user.section;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.busId = token.busId;
        session.user.section = token.section;
      }
      return session;
    }
  },
  pages: {
    signIn: "/", // Redirects to your login page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };