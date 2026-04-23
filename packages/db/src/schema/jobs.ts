import { jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const jobStatusEnum = pgEnum("job_status", [
  "running",
  "completed",
  "failed",
  "cancelled",
])

export const jobs = pgTable("jobs", {
  id: text("id").primaryKey(),
  runId: text("run_id"),
  target: text("target").notNull(),
  status: jobStatusEnum("status").default("running").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  result: jsonb("result"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
