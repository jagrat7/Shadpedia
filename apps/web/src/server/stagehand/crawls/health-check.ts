import type { Stagehand } from "@browserbasehq/stagehand"
import { z } from "zod"

/**
 * Run the main Stagehand script
 */
export async function defaultCrawl(stagehand: Stagehand, info: (msg: string) => void) {
  const page = stagehand.context.activePage()

  info("Navigating to docs.stagehand.dev...")
  await page?.goto("https://docs.stagehand.dev/")
  info("Page loaded, clicking quickstart link...")
  await stagehand.act("click the quickstart link")
  info("Extracting page heading...")
  const { title } = await stagehand.extract(
    "extract the main heading of the page",
    z.object({
      title: z.string(),
    }),
  )
  info(`Extracted title: ${title}`)

  return title
}
