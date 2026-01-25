import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const usersCollection = client.db("BusAttendance").collection("users");
        
        // Find user by email
        const user = await usersCollection.findOne({ email: credentials.email });

        // Simple password check (In production, use bcrypt to compare hashed passwords!)
        if (user && user.password === credentials.password) {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            busId: user.busId,
            section: user.section,
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
      session.user.busId = token.busId;
      session.user.section = token.section;
      return session;
    }
  },
  pages: {
    signIn: "/", // Redirect to home page for login
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };