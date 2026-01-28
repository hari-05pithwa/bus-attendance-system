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

        const client = await clientPromise;
        const usersCollection = client.db("BusAttendance").collection("users");

        const busIdNumber = parseFloat(credentials.email);

        const user = await usersCollection.findOne({
          busId: busIdNumber,
          password: credentials.password,
        });

        if (user) {
          return {
            id: user._id.toString(),
            name: user.name,
            busId: user.busId,
            role: user.role || "admin", // Passes "superadmin" if role exists in DB
            section: user.section || "Admin",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.busId = user.busId;
        token.role = user.role; // Store role in JWT
        token.section = user.section;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.busId = token.busId;
        session.user.role = token.role; // Make role available in frontend
        session.user.section = token.section;
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
