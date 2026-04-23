import type { Stagehand } from "@browserbasehq/stagehand"
import { Result } from "better-result"
import { z } from "zod"
import { type DiscoverError, DiscoverExtractionError, DiscoverLinkValidationError, DiscoverNavigationError } from "../errors"
export const componentLinkSchema = z.object({
  name: z.string().describe("The display name of the component"),
  url: z.string().describe("The absolute URL to the component's documentation page"),
})

export type ComponentLink = z.infer<typeof componentLinkSchema>

export async function discoverCrawl(
  stagehand: Stagehand,
  info: (msg: string) => void,
  indexUrl: string,
): Promise<Result<ComponentLink[], DiscoverError>> {
  return Result.gen(async function* () {
    const page = stagehand.context.activePage()

    if (!page) {
      return yield* Result.err(new DiscoverNavigationError({ url: indexUrl, message: "No active page available" }))
    }

    info(`Navigating to ${indexUrl}...`)

    const toNavError = (e: unknown) =>
      new DiscoverNavigationError({ url: indexUrl, message: e instanceof Error ? e.message : String(e) })

    yield* (await Result.tryPromise(() => page.goto(indexUrl))).mapError(toNavError)
    yield* (await Result.tryPromise(() => page.waitForLoadState("domcontentloaded"))).mapError(toNavError)

    info(`indexUrl received: "${indexUrl}"`)
    info("Discovering component links...")

    // indexUrl: "https://uselayouts.com/docs/components"
    // origin:   "https://uselayouts.com"
    const { origin } = new URL(indexUrl)

    const links = yield* (
      await Result.tryPromise(() =>
        stagehand.extract(
          `Extract the frist 3 component links from the "Components" section of the navigation sidebar on this page.

    Return only links to individual component documentation pages. For each link return:
    - the display name exactly as shown in the nav
    - the exact href value from the anchor tag (e.g. /docs/components/3d-book) — do not modify or shorten it

    Do not include Installation, Introduction, or any non-component pages.`,
          z.array(componentLinkSchema),
        ),
      )
    ).mapError((e: unknown) => new DiscoverExtractionError({ message: e instanceof Error ? e.message : String(e) }))

    info(`Raw links from LLM: ${JSON.stringify(links)}`)

    // indexUrl may be a component page: "https://uselayouts.com/docs/components/3d-book"
    // we want basePath = parent dir:    "/docs/components/"
    // so that all sibling component slugs pass the check
    let basePath: string
    try {
      const { pathname } = new URL(indexUrl)
      basePath = pathname.endsWith("/") ? pathname : `${pathname.slice(0, pathname.lastIndexOf("/"))}/`
    } catch {
      return yield* Result.err(new DiscoverNavigationError({ url: indexUrl, message: `indexUrl "${indexUrl}" could not be parsed` }))
    }

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
        ;({ pathname, href: url } = new URL(rawUrl))
        // startsWith alone would accept the index page itself, e.g. /docs/components/ === basePath
        // length check ensures there's a slug after it, e.g. /docs/components/button ✓
        if (!pathname.startsWith(basePath) || pathname.length <= basePath.length) {
          throw new Error(`does not match expected pattern "${basePath}*"`)
        }
      } catch (e) {
        return yield* Result.err(
          new DiscoverLinkValidationError({
            raw: link.url,
            normalized: rawUrl,
            basePath,
            message: e instanceof Error ? e.message : String(e),
          }),
        )
      }

      resolved.push({ ...link, url })
    }

    info(`Discovered ${resolved.length} components`)

    return Result.ok(resolved)
  })
}
