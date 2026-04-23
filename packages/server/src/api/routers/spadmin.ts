import { randomUUID } from "node:crypto"
import { getRun, start } from "workflow/api"
import { desc, eq, schema } from "@my-better-t-app/db"
import { z } from "zod"

import { publicProcedure, router } from "../index"
import { scrapeWorkflow, type StagehandRunResult } from "../../services/stagehand"

const createJobInputSchema = z.object({
  target: z.string().trim().url(),
})

type PersistedJob = typeof schema.jobs.$inferSelect

function serializeJob(job: PersistedJob) {
  return {
    id: job.id,
    runId: job.runId,
    target: job.target,
    status: job.status,
    startedAt: job.startedAt.toISOString(),
    result: (job.result as StagehandRunResult | null) ?? null,
    errorMessage: job.errorMessage,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  }
}

async function syncJob(ctx: { db: typeof import("@my-better-t-app/db").db }, job: PersistedJob) {
  if (job.status !== "running" || !job.runId) {
    return job
  }

  const run = getRun<StagehandRunResult>(job.runId)
  const runStatus = await run.status

  if (runStatus === "running") {
    return job
  }

  const failedStatus: PersistedJob["status"] = runStatus === "cancelled" ? "cancelled" : "failed"
  const nextValues =
    runStatus === "completed"
      ? {
          status: "completed" as const,
          result: await run.returnValue,
          errorMessage: null,
        }
      : {
          status: failedStatus,
          result: null,
          errorMessage: `Workflow ${runStatus}`,
        }

  const [updatedJob] = await ctx.db
    .update(schema.jobs)
    .set(nextValues)
    .where(eq(schema.jobs.id, job.id))
    .returning()

  return updatedJob ?? job
}

async function listJobs(ctx: { db: typeof import("@my-better-t-app/db").db }) {
  const jobs = await ctx.db
    .select()
    .from(schema.jobs)
    .orderBy(desc(schema.jobs.startedAt), desc(schema.jobs.createdAt))

  const syncedJobs = await Promise.all(jobs.map((job) => syncJob(ctx, job)))

  return syncedJobs.map(serializeJob)
}

export const spadminRouter = router({
  createJob: publicProcedure.input(createJobInputSchema).mutation(async ({ ctx, input }) => {
    const jobId = randomUUID()
    const trimmedTarget = input.target.trim()

    await ctx.db.insert(schema.jobs).values({
      id: jobId,
      target: trimmedTarget,
      status: "running",
    })

    try {
      const run = await start(scrapeWorkflow, [trimmedTarget])

      const [updatedJob] = await ctx.db
        .update(schema.jobs)
        .set({
          runId: run.runId,
        })
        .where(eq(schema.jobs.id, jobId))
        .returning()

      if (!updatedJob) {
        throw new Error("Failed to update job with workflow run id")
      }

      return serializeJob(updatedJob)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)

      const [failedJob] = await ctx.db
        .update(schema.jobs)
        .set({
          status: "failed",
          errorMessage: message,
        })
        .where(eq(schema.jobs.id, jobId))
        .returning()

      if (!failedJob) {
        throw new Error("Failed to persist job failure")
      }

      return serializeJob(failedJob)
    }
  }),
  listJobs: publicProcedure.query(async ({ ctx }) => {
    return listJobs(ctx)
  }),
})
