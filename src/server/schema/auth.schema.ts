import z from "zod";

import { hasDigitRegex, hasSpecialCharacterRegex } from "@/utils/validators";

export const loginSchema = z.object({
  email: z
    .string()
    .min(3, { message: "Email must contain at least 3 characters" })
    .max(255, { message: "Email must contain at most 255 characters" })
    .email({ message: "Email must be a valid email address" }),
  password: z
    .string()
    .min(12, { message: "Password must contain at least 12 characters" })
    .max(255, { message: "Password must contain at most 255 characters" })
    .regex(hasDigitRegex, {
      message: "Password must contain at least one digit",
    })
    .regex(hasSpecialCharacterRegex, {
      message: "Password must contain at least one special character",
    }),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name must contain at least 1 character")
      .max(255, "First name must contain at most 255 characters"),
    lastName: z.string().optional(),
  })
  .merge(loginSchema);

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
