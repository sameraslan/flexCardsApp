import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verify } from "argon2";
import NextAuth, { type NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import FacebookProvider from "next-auth/providers/facebook";
// import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/server/db/client";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "",
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}/app/decks`;
    },
    async jwt({ token }) {
      if (token.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: token?.email?.toLowerCase(),
            },
            select: {
              id: true,
              name: true,
              email: true,
              emailVerified: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          });

          if (existingUser) {
            return {
              user: existingUser,
            };
          }
        } catch (error) {
          process.env.NODE_ENV === "development"
            ? console.error("Authorization error: ", error)
            : null;

          return token;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
