import type { Stagehand } from "@browserbasehq/stagehand"
import { FatalError, RetryableError } from "workflow"
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
  const page = stagehand.context.activePage()

  if (!page) {
    throw new FatalError("No active page available, stagehand may not be initialized")
  }

  info(`Navigating to ${indexUrl}...`)
  await page.goto(indexUrl)
  await page.waitForLoadState("domcontentloaded")
  info("Discovering component links...")

  info(`indexUrl received: "${indexUrl}"`)
  // indexUrl: "https://uselayouts.com/docs/components"
  // origin:   "https://uselayouts.com"
  const { origin } = new URL(indexUrl)

  const links = await stagehand.extract(
    `Extract the frist 3 component links from the "Components" section of the navigation sidebar on this page.

    Return only links to individual component documentation pages. For each link return:
    - the display name exactly as shown in the nav
    - the sliced href value of the component from the anchor tag e.g. /docs/components/3d-book. do not include the origin.

    Do not include Installation, Introduction, or any non-component pages.`,
    z.array(componentLinkSchema),
  )
  // used to validate LLM links are siblings of indexUrl, not hallucinated paths
  const { pathname: indexPathname } = new URL(indexUrl)
  const basePath = indexPathname.endsWith("/") ? indexPathname : `${indexPathname.slice(0, indexPathname.lastIndexOf("/"))}/`

  info(`Raw links from LLM: ${JSON.stringify(links)}`)

  const resolved: ComponentLink[] = []
  for (const link of links) {
    // LLM may return: absolute URL, path with leading slash, or bare slug
    // normalize all to absolute URL before parsing
    let rawUrl = link.url
    if (!rawUrl.startsWith("http")) {
      rawUrl = rawUrl.startsWith("/") ? `${origin}${rawUrl}` : `${origin}/${rawUrl}`
    }
    let url: string
    let pathname: string
    try {
      ({ pathname, href: url } = new URL(rawUrl))
    } catch {
      throw new RetryableError(`Link "${link.url}" could not be parsed as a valid URL`)
    }
    // startsWith alone would accept the index page itself, e.g. /docs/components/ === basePath
    // length check ensures there's a slug after it, e.g. /docs/components/button ✓
    if (!pathname.startsWith(basePath) || pathname.length <= basePath.length) {
      throw new RetryableError(`Link "${url}" does not match expected pattern "${basePath}*"`)
    }
    resolved.push({ ...link, url: url })
  }

  info(`Discovered ${resolved.length} components`)

  return resolved
}
