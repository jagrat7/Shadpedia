"use server"

import { getRun, start } from "workflow/api"
import { scrapeWorkflow, type StagehandRunResult } from "../../server/stagehand"

export async function runStagehand(url: string): Promise<{ runId: string }> {
  const run = await start(scrapeWorkflow, [url])
  return { runId: run.runId }
}

export async function getRunStatus(runId: string): Promise<{ status: string }> {
  const run = getRun<StagehandRunResult>(runId)
  const status = await run.status
  return { status }
}

export async function getRunResult(runId: string): Promise<StagehandRunResult | null> {
  const run = getRun<StagehandRunResult>(runId)
  const status = await run.status
  if (status !== "completed") return null
  return run.returnValue
}
