import type { Stagehand } from "@browserbasehq/stagehand"
import { z } from "zod"
import type { ComponentLink } from "./discover-crawl"

export const extractedComponentSchema = z.object({
  name: z.string().describe("The canonical component name shown in the documentation"),
  description: z
    .string()
    .describe(
      "A concise 1 to 2 sentence summary of what the component does based on the visible docs and example code",
    ),
})

export type ExtractedComponent = z.infer<typeof extractedComponentSchema>

export async function componentsCrawl(
  stagehand: Stagehand,
  info: (msg: string) => void,
  links: ComponentLink[],
): Promise<ExtractedComponent[]> {
  "use step"
  const page = stagehand.context.activePage()

  if (!page) {
    throw new Error("No active page available")
  }

  const results: ExtractedComponent[] = []

  for (const link of links) {
    info(`Scraping ${link.name} at ${link.url}...`)
    await page.goto(link.url)
    await page.waitForLoadState("domcontentloaded")

    const codeTabActions = await stagehand.observe(
      "find the code tab, code button, or code example toggle for the main documented component on this page",
    )
    const codeTabAction = codeTabActions.find((action) => action.method === "click")

    if (codeTabAction) {
      info(`Opening code example for ${link.name}...`)
      await stagehand.act(codeTabAction)
    }

    const [component] = await stagehand.extract(
      `Extract the main documented component from the current page.

      Return exactly one component with:
      - the canonical component name shown on the page
      - a concise description based on the heading, surrounding documentation, and any visible code example

      Do not invent data. If no component is clearly documented, return an empty array.`,
      z.array(extractedComponentSchema),
    )

    if (component) {
      results.push(component)
    }
  }

  info(`Extracted ${results.length} components`)

  return results
}
