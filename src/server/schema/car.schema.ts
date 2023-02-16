import { CarType, EngineType, GearboxType } from "@prisma/client";
import z from "zod";

export const carParams = z.object({
  carId: z.string(),
});

export const createCarSchema = z.object({
  type: z.nativeEnum(CarType).optional(),
  make: z.string().min(1),
  model: z.string().min(1),
  vin: z.string().optional(),
  generation: z.string().optional(),
  productionYear: z
    .number()
    .nonnegative()
    .gte(1885)
    .lte(new Date().getFullYear()),
  engineType: z.nativeEnum(EngineType).optional(),
  engineCapacity: z.number().nonnegative().optional(),
  enginePower: z.number().nonnegative().optional(),
  gearboxType: z.nativeEnum(GearboxType).optional(),
});

export const updateCarSchema = z.object({
  params: carParams,
  body: createCarSchema,
});

export type CarParams = z.infer<typeof carParams>;
export type CreateCarSchema = z.infer<typeof createCarSchema>;
export type UpdateCarSchema = z.infer<typeof updateCarSchema>;
