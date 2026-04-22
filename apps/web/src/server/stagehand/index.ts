import { Stagehand } from "@browserbasehq/stagehand"
import { env } from "@my-better-t-app/env/server"
import { createRunLogger } from "./utils"
import { discoverCrawl, type ComponentLink } from "./crawls/discover-crawl"
import { componentsCrawl, type ExtractedComponent } from "./crawls/components-crawl"

export type { ExtractedComponent } from "./crawls/components-crawl"

export type StagehandRunResult = {
  components: ExtractedComponent[]
  logs: string[]
}

function createStagehand(handleStagehandLog: ConstructorParameters<typeof Stagehand>[0]["logger"]) {
  return new Stagehand({
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
}

async function discoverStep(url: string): Promise<{ links: ComponentLink[]; logs: string[] }> {
  "use step"

  const { info, logs, handleStagehandLog } = createRunLogger()
  const stagehand = createStagehand(handleStagehandLog)
  await stagehand.init()

  try {
    const links = await discoverCrawl(stagehand, info, url)
    return { links, logs }
  } finally {
    await stagehand.close()
  }
}

async function componentsStep(
  links: ComponentLink[],
): Promise<{ components: ExtractedComponent[]; logs: string[] }> {
  "use step"

  const { info, logs, handleStagehandLog } = createRunLogger()
  const stagehand = createStagehand(handleStagehandLog)
  await stagehand.init()

  try {
    const components = await componentsCrawl(stagehand, info, links)
    return { components, logs }
  } finally {
    await stagehand.close()
  }
}

export async function scrapeWorkflow(url: string): Promise<StagehandRunResult> {
  "use workflow"

  const { links, logs: discoverLogs } = await discoverStep(url)
  const { components, logs: componentLogs } = await componentsStep(links)

  return { components, logs: [...discoverLogs, ...componentLogs] }
}
