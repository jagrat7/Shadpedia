// 🤘 Welcome to Stagehand!
// This file is from the [Stagehand docs](https://docs.stagehand.dev/sections/examples/nextjs).

"use server"

import { Stagehand, type LogLine } from "@browserbasehq/stagehand"
import { z } from "zod"
import { env } from "@my-better-t-app/env/server"

 function stringifyLogAuxiliary(logLine: LogLine) {
  if (!logLine.auxiliary) {
    return ""
  }

  return Object.entries(logLine.auxiliary)
    .map(([key, item]) => {
      if (item.type === "object") {
        return `${key}=${item.value}`
      }

      return `${key}=${item.value}`
    })
    .join(" | ")
 }

 function formatStagehandLog(logLine: LogLine) {
  const parts = [logLine.category ? `[${logLine.category}]` : null, logLine.message]
  const auxiliary = stringifyLogAuxiliary(logLine)

  if (auxiliary) {
    parts.push(auxiliary)
  }

  return parts.filter(Boolean).join(" ")
 }

/**
 * Run the main Stagehand script
 */
async function main(stagehand: Stagehand, log: (msg: string) => void) {
  // You can use the `page` instance to write any Playwright code
  // For more info: https://playwright.dev/docs/pom
  const page = stagehand.context.activePage();

  // In this example, we'll get the title of the Stagehand quickstart page
  log("Navigating to docs.stagehand.dev...")
  await page?.goto("https://docs.stagehand.dev/");
  log("Page loaded, clicking quickstart link...")
  await stagehand.act("click the quickstart link");
  log("Extracting page heading...")
  const { title } = await stagehand.extract(
    "extract the main heading of the page",
    z.object({
      title: z.string(),
    }),
  );
  log(`Extracted title: ${title}`)

  return title;
}

/**
 * Initialize and run the main() function
 */
export async function runStagehand() {
  const logs: string[] = []
  const log = (msg: string) => {
    const ts = new Date().toLocaleTimeString()
    const line = `[${ts}] ${msg}`
    logs.push(line)
    console.log(line)
  }

  log("Initializing Stagehand (LOCAL, gemini-3-flash-preview)...")
  const stagehand = new Stagehand({
    env: "LOCAL",
    verbose: 1,
    logger: (logLine: LogLine) => {
      log(formatStagehandLog(logLine))
    },
    disablePino: true,
    model: {
      modelName: "gateway/zai/glm-5",
      apiKey: env.VERCEL_AI_GATEWAY_API_KEY,
    },
  })
  await stagehand.init()
  log("Stagehand initialized, launching browser...")

  const result = await main(stagehand, log)
  log("Closing browser...")
  await stagehand.close()
  log("Done.")

  return { result, logs }
}