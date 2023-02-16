import z from "zod";

export const repairParams = z.object({
  repairId: z.string(),
  carId: z.string(),
});

export const createRepairSchema = z.object({
  params: repairParams.pick({ carId: true }),
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    price: z.number().nonnegative().optional(),
    date: z.string().optional(),
    mileage: z.number().nonnegative().optional(),
  }),
});

export const updateRepairSchema = z.object({
  params: repairParams,
  body: createRepairSchema.shape.body,
});

export type RepairParams = z.infer<typeof repairParams>;
export type CreateRepairSchema = z.infer<typeof createRepairSchema>;
export type UpdateRepairSchema = z.infer<typeof updateRepairSchema>;
