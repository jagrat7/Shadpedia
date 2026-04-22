import "@my-better-t-app/env/web"
import type { NextConfig } from "next"
import { withWorkflow } from "workflow/next"

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
}

export default withWorkflow(nextConfig)
