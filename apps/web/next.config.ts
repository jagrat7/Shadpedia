import dotenv from "dotenv"
import "@my-better-t-app/env/web"
import type { NextConfig } from "next"
import { withWorkflow } from "workflow/next"

const ENV_PATH = "../../.env"

dotenv.config({
  path: ENV_PATH,
})

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
}

export default withWorkflow(nextConfig)
