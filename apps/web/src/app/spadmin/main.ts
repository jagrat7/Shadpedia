// 🤘 Welcome to Stagehand!
// This file is from the [Stagehand docs](https://docs.stagehand.dev/sections/examples/nextjs).

"use server"

import { runStagehandJob, type StagehandRunResult } from "../../server/stagehand"

export async function runStagehand(url: string): Promise<StagehandRunResult> {
  return runStagehandJob(url)
}