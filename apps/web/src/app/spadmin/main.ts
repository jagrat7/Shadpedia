"use server"

import { start } from "workflow/api"
import { scrapeWorkflow } from "../../server/stagehand"



export async function runStagehand(url: string): Promise<{ runId: string }> {
  const run = await start(scrapeWorkflow, [url])
  return { runId: run.runId }
}
