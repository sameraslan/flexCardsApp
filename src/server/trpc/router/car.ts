import { TRPCError } from "@trpc/server";

import {
  carParams,
  createCarSchema,
  updateCarSchema,
} from "@/server/schema/car.schema";
import { protectedProcedure, router } from "@/server/trpc/trpc";

export const carRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.car.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        type: true,
        make: true,
        model: true,
        vin: true,
        generation: true,
        productionYear: true,
      },
    });
  }),
  getAllWithRepairs: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.car.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        type: true,
        make: true,
        model: true,
        vin: true,
        generation: true,
        productionYear: true,
        repairs: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            mileage: true,
            price: true,
          },
        },
      },
    });
  }),
  getOne: protectedProcedure.input(carParams).query(async ({ input, ctx }) => {
    return await ctx.prisma.car.findFirst({
      where: {
        id: input.carId,
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        type: true,
        make: true,
        model: true,
        productionYear: true,
      },
    });
  }),
  create: protectedProcedure
    .input(createCarSchema)
    .mutation(async ({ input, ctx }) => {
      const car = await ctx.prisma.car.create({
        data: {
          userId: ctx.session.user.id,
          ...input,
        },
      });

      if (!car)
        throw new TRPCError({ code: "NOT_FOUND", message: "Car not added" });

      return car;
    }),
  update: protectedProcedure
    .input(updateCarSchema)
    .mutation(async ({ input, ctx }) => {
      const car = await ctx.prisma.car.findUnique({
        where: {
          id: input.params.carId,
        },
      });

      if (!car) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Car not found" });
      }

      if (car.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Denied access to resources",
        });
      }

      const { make, model, ...restBody } = input.body;

      return await ctx.prisma.car.update({
        where: {
          id: input.params.carId,
        },
        data: {
          make: make || car.make,
          model: model || car.model,
          ...restBody,
        },
      });
    }),
  delete: protectedProcedure
    .input(carParams)
    .mutation(async ({ input, ctx }) => {
      const car = await ctx.prisma.car.findUnique({
        where: {
          id: input.carId,
        },
      });

      if (!car) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Car not found" });
      }

      if (car.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Denied access to resources",
        });
      }
      await ctx.prisma.car.delete({
        where: {
          id: input.carId,
        },
      });

      return {};
    }),
});
