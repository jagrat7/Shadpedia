import { createContext } from "@my-better-t-app/api/context"
import { appRouter } from "@my-better-t-app/api/routers/index"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { auth } from "@clerk/nextjs/server"

const TRPC_ENDPOINT = "/api/trpc"

const handler = async (request: Request) => {
  const authContext = await auth()

  return fetchRequestHandler({
    endpoint: TRPC_ENDPOINT,
    req: request,
    router: appRouter,
    createContext: () =>
      createContext({
        auth: {
          orgId: authContext.orgId ?? null,
          sessionId: authContext.sessionId ?? null,
          userId: authContext.userId ?? null,
        },
        headers: request.headers,
      }),
  })
}

export { handler as GET, handler as POST }
