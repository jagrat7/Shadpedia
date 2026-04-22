import type { Stagehand } from "@browserbasehq/stagehand"
import { z } from "zod"

export const componentLinkSchema = z.object({
  name: z.string().describe("The display name of the component"),
  url: z.string().describe("The absolute URL to the component's documentation page"),
})

export type ComponentLink = z.infer<typeof componentLinkSchema>

export async function discoverCrawl(
  stagehand: Stagehand,
  info: (msg: string) => void,
  indexUrl: string,
): Promise<ComponentLink[]> {
  "use step"

  const page = stagehand.context.activePage()

  if (!page) {
    throw new Error("No active page available")
  }

  info(`Navigating to ${indexUrl}...`)
  await page.goto(indexUrl)
  await page.waitForLoadState("domcontentloaded")
  info("Discovering component links...")

  const { origin } = new URL(indexUrl)

  const links = await stagehand.extract(
    `Extract the frist 3 component links from the "Components" section of the navigation sidebar on this page.

    Return only links to individual component documentation pages. For each link return:
    - the display name exactly as shown in the nav
    - the exact href value from the anchor tag (e.g. /docs/components/3d-book) — do not modify or shorten it

    Do not include Installation, Introduction, or any non-component pages.`,
    z.array(componentLinkSchema),
  )

  const resolved = links.map((link: ComponentLink) => ({
    ...link,
    url: link.url.startsWith("http") ? link.url : `${origin}${link.url}`,
  }))

  info(`Discovered ${resolved.length} components`)

  return resolved
}
