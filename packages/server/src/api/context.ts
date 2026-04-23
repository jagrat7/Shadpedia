import { db } from "@my-better-t-app/db"

export type AuthContext = {
  orgId: string | null
  sessionId: string | null
  userId: string | null
}

export type CreateContextOptions = {
  auth: AuthContext
  headers: Headers
}

export function createContext({ auth, headers }: CreateContextOptions) {
  return {
    auth,
    db,
    headers,
  }
}

export type Context = ReturnType<typeof createContext>
