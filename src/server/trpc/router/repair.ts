import { TRPCError } from "@trpc/server";

import {
  createRepairSchema,
  repairParams,
  updateRepairSchema,
} from "@/server/schema/repair.schema";

import { protectedProcedure, router } from "../trpc";

export const repairRouter = router({
  getAll: protectedProcedure
    .input(repairParams.pick({ carId: true }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.repair.findMany({
        where: {
          carId: input.carId,
          AND: {
            car: {
              userId: ctx.session.user.id,
            },
          },
        },
        orderBy: {
          mileage: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          date: true,
          mileage: true,
          carId: true,
        },
      });
    }),
  getOne: protectedProcedure
    .input(repairParams)
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.repair.findFirst({
        where: {
          id: input.repairId,
          carId: input.carId,
          AND: {
            car: {
              userId: ctx.session.user.id,
            },
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          date: true,
          mileage: true,
          car: {
            select: {
              id: true,
            },
          },
        },
      });
    }),
  getHighestMileage: protectedProcedure
    .input(repairParams.pick({ carId: true }))
    .query(async ({ input, ctx }) => {
      const repair = await ctx.prisma.repair.findFirst({
        where: {
          carId: input.carId,
          AND: {
            car: {
              userId: ctx.session.user.id,
            },
          },
        },
        orderBy: {
          mileage: "desc",
        },
        select: {
          id: true,
          mileage: true,
        },
      });

      if (!repair)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Repair not found",
        });

      return repair;
    }),
  getFirstRepairDate: protectedProcedure
    .input(repairParams.pick({ carId: true }))
    .query(async ({ input, ctx }) => {
      const repair = await ctx.prisma.repair.findFirst({
        where: {
          carId: input.carId,
          AND: {
            car: {
              userId: ctx.session.user.id,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
        select: {
          id: true,
          date: true,
        },
      });

      if (!repair)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Repair not found",
        });

      return repair;
    }),
  create: protectedProcedure
    .input(createRepairSchema)
    .mutation(async ({ input, ctx }) => {
      const { date, ...restBody } = input.body;

      const repair = await ctx.prisma.repair.create({
        data: {
          carId: input.params.carId,
          date: date ? new Date(date) : null,
          ...restBody,
        },
      });

      if (!repair)
        throw new TRPCError({ code: "NOT_FOUND", message: "Repair not added" });

      return repair;
    }),
  update: protectedProcedure
    .input(updateRepairSchema)
    .mutation(async ({ input, ctx }) => {
      const repair = await ctx.prisma.repair.findUnique({
        where: {
          id: input.params.repairId,
        },
        include: {
          car: true,
        },
      });

      if (!repair || repair.carId !== input.params.carId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Repair not found" });
      }

      if (repair.car.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Denied access to resources",
        });
      }

      const { title, date, ...restBody } = input.body;

      return await ctx.prisma.repair.update({
        where: {
          id: input.params.repairId,
        },
        data: {
          title: title || repair.title,
          date: date ? new Date(date) : null,
          ...restBody,
        },
      });
    }),
  delete: protectedProcedure
    .input(repairParams)
    .mutation(async ({ input, ctx }) => {
      const repair = await ctx.prisma.repair.findUnique({
        where: {
          id: input.repairId,
        },
        include: {
          car: true,
        },
      });

      if (!repair) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Repair not found" });
      }

      if (repair.car.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Denied access to resources",
        });
      }
      await ctx.prisma.repair.delete({
        where: {
          id: input.repairId,
        },
      });

      return {};
    }),
});
