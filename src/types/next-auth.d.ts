import type { User } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface Profile {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: Omit<User, "hash" | "createdAt" | "updatedAt">;
  }
}
