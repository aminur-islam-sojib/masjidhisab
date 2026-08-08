import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
 
import { User } from "../db/Model/User";
import connectDB from "../mongoose";

// Extend NextAuth types
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


export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.mosqueId = user.mosqueId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.mosqueId = token.mosqueId as string | null;
      }
      return session;
    },
  },
  providers: [], // Leave empty, we will add providers in auth.ts
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);