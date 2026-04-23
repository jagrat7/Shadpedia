import { publicProcedure, router } from "../index"
import { spadminRouter } from "./spadmin"

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK"
  }),
  spadmin: spadminRouter,
})

export type AppRouter = typeof appRouter
