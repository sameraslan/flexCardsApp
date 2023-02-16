import { authRouter } from "@/server/trpc/router/auth";
import { carRouter } from "@/server/trpc/router/car";
import { repairRouter } from "@/server/trpc/router/repair";
import { router } from "@/server/trpc/trpc";

export const appRouter = router({
  auth: authRouter,
  car: carRouter,
  repair: repairRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
