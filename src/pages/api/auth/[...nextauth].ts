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
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: {
    //       label: "Address email",
    //       type: "email",
    //       placeholder: "john@doe.com",
    //     },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     try {
    //       const user = await prisma.user.findUnique({
    //         where: { email: credentials?.email.toLowerCase() },
    //       });

    //       if (!user || !user?.hash || !credentials?.password) {
    //         throw new Error("Incorrect username or password");
    //       }

    //       const isValidPassword = await verify(user.hash, credentials.password);

    //       if (!isValidPassword) {
    //         throw new Error("Incorrect username or password");
    //       }

    //       const { hash, ...userWithoutHash } = user;

    //       return userWithoutHash;
    //     } catch (error) {
    //       if (error instanceof Error) {
    //         process.env.NODE_ENV === "development"
    //           ? console.error("Authorization error: ", error.message)
    //           : null;

    //         throw new Error(error.message);
    //       }

    //       return null;
    //     }
    //   },
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID || "",
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID || "",
    //   clientSecret: process.env.GITHUB_SECRET || "",
    // }),
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}/app`;
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
