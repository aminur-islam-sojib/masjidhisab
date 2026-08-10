import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db/mongoose"; // Use your new cached connection
import { authConfig } from "./auth.config";
import { User } from "../Model/User";

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

        const user = await User.findOne({ email: credentials.email }).select(
          "+password",
        );
        if (!user || !user.password) return null;

        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
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

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Initial sign-in: capture user details from authorize()
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.mosqueId = user.mosqueId;
      }

      // 2. Allow programmatic session updates (e.g., from client update() call)
      if (trigger === "update" && session?.mosqueId) {
        token.mosqueId = session.mosqueId;
      }

      // 3. BULLETPROOF FIX: If token has no mosqueId, check MongoDB once
      // This catches when a mosque was created AFTER initial login
      if (token.id && !token.mosqueId) {
        await connectDB();
        const dbUser = await User.findById(token.id)
          .select("mosqueId role")
          .lean();
        if (dbUser?.mosqueId) {
          token.mosqueId = dbUser.mosqueId.toString();
          if (dbUser.role) token.role = dbUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.mosqueId = (token.mosqueId as string) || null;
      }
      return session;
    },
  },
});
