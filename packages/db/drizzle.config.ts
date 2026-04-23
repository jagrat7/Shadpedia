import dotenv from "dotenv"
import { defineConfig } from "drizzle-kit"

const ENV_PATH = "../../.env"
const MIGRATIONS_PATH = "./src/migrations"
const SCHEMA_PATH = "./src/schema/index.ts"

dotenv.config({
  path: ENV_PATH,
})

export default defineConfig({
  schema: SCHEMA_PATH,
  out: MIGRATIONS_PATH,
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
})
