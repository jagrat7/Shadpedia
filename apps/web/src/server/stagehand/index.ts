import { Stagehand } from "@browserbasehq/stagehand"
import { env } from "@my-better-t-app/env/server"
import { createRunLogger } from "./utils"
import { discoverCrawl } from "./crawls/discover-crawl"
import { componentsCrawl, type ExtractedComponent } from "./crawls/components-crawl"

export type { ExtractedComponent } from "./crawls/components-crawl"


export type StagehandRunResult = {
  components: ExtractedComponent[]
  logs: string[]
}

/**
 * Initialize and run the main() function
 */
export async function runStagehandJob(url: string): Promise<StagehandRunResult> {


  const { info, logs, handleStagehandLog } = createRunLogger()

  info("Initializing Stagehand (LOCAL)...")
  const stagehand = new Stagehand({
    env: "LOCAL",
    experimental: true,
    cacheDir: "cache/component-docs-flow",
    verbose: 1,
    logger: handleStagehandLog,
    disablePino: true,
    model: {
      modelName: "gateway/anthropic/claude-haiku-4.5",
      apiKey: env.VERCEL_AI_GATEWAY_API_KEY,
    },
  })
  await stagehand.init()
  info("Stagehand initialized, launching browser...")

  try {
    const links = await discoverCrawl(stagehand, info, url)
    const components = await componentsCrawl(stagehand, info, links)
    info("Done.")

    return { components, logs }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    info(`Stagehand run failed: ${message}`)
    throw error
  } finally {
    info("Closing browser...")
    await stagehand.close()
  }
}
