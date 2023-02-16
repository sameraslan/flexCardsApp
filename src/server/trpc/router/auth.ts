import { TRPCError } from "@trpc/server";
import { hash } from "argon2";

import { registerSchema } from "@/server/schema/auth.schema";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const { password, ...body } = input;
      const exists = await ctx.prisma.user.findUnique({
        where: { email: body.email },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email is invalid or already taken",
        });
      }

      const hashedPassword = await hash(password);

      const user = await ctx.prisma.user.create({
        data: {
          ...body,
          name: body.lastName
            ? `${body.firstName} ${body.lastName}`
            : body.firstName,
          hash: hashedPassword,
        },
      });

      const { hash: hashPassword, ...result } = user;

      return result;
    }),
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
});
