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

const stagehandModelGateway = "gateway"

const defaultStagehandModel = {
  modelName: "anthropic/claude-haiku-4-5",
  apiKey: env.VERCEL_AI_GATEWAY_API_KEY,
}

function createStagehand(
  handleStagehandLog: ConstructorParameters<typeof Stagehand>[0]["logger"],
  modelName: string = defaultStagehandModel.modelName,
) {
  return new Stagehand({
    env: "LOCAL",
    experimental: true,
    cacheDir: "cache/component-docs-flow",
    verbose: 1,
    logger: handleStagehandLog,
    disablePino: true,
    model: {
      modelName: `${stagehandModelGateway}/${modelName}`,
      apiKey: defaultStagehandModel.apiKey,
    },
  })
}
//moonshotai/kimi-k2.5 anthropic/claude-haiku-4-5
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

discoverStep.maxRetries = 5

async function componentsStep(
  links: ComponentLink[],
): Promise<{ components: ExtractedComponent[]; logs: string[] }> {
  "use step"

  const { info, logs, handleStagehandLog } = createRunLogger()
  const stagehand = createStagehand(handleStagehandLog, "zai/glm-5")
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
