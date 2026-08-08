import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
 
import connectDB from "@/lib/mongoose"; // Use your new cached connection
import { authConfig } from "./auth.config";
import { User } from "../db/Model/User";

// Extend NextAuth types (can also be moved to a global d.ts file)
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      mosqueId?: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    role: string;
    mosqueId?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        
        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user || !user.password) return null;

        const isMatch = await bcrypt.compare(credentials.password as string, user.password);
        if (!isMatch) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          mosqueId: user.mosqueId ? user.mosqueId.toString() : null,
        };
      },
    }),
  ],
});