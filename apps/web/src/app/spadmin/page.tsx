"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Check, Play, RotateCw, X } from "lucide-react"
import { Badge } from "@my-better-t-app/ui/components/badge"
import { Button } from "@my-better-t-app/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@my-better-t-app/ui/components/card"
import { Input } from "@my-better-t-app/ui/components/input"
import { ScrollArea } from "@my-better-t-app/ui/components/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@my-better-t-app/ui/components/tabs"
import { getRunResult, getRunStatus, runStagehand } from "./main"
import type { StagehandRunResult } from "../../server/stagehand"

type JobStatus = "running" | "completed" | "failed" | "cancelled"

interface Job {
  id: string
  runId: string
  target: string
  status: JobStatus
  startedAt: string
  result: StagehandRunResult | null
}

const STATUS_VARIANT: Record<JobStatus, "default" | "secondary" | "destructive" | "outline"> = {
  running: "secondary",
  completed: "default",
  failed: "destructive",
  cancelled: "outline",
}

function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className="gap-1 uppercase text-[10px] tracking-widest">
      {status === "running" && <RotateCw className="h-3 w-3 animate-spin" />}
      {status === "completed" && <Check className="h-3 w-3" />}
      {status === "failed" && <X className="h-3 w-3" />}
      {status}
    </Badge>
  )
}

function JobRow({ job, onResult }: { job: Job; onResult: (id: string, result: StagehandRunResult, status: JobStatus) => void }) {
  const [expanded, setExpanded] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (job.status !== "running") return

    intervalRef.current = setInterval(async () => {
      const { status } = await getRunStatus(job.runId)
      if (status === "running") return
      clearInterval(intervalRef.current!)
      const result = await getRunResult(job.runId)
      onResult(job.id, result ?? { components: [], logs: [] }, status as JobStatus)
    }, 3000)

    return () => clearInterval(intervalRef.current!)
  }, [job.runId, job.status, job.id, onResult])

  const logs = job.result?.logs ?? []
  const components = job.result?.components ?? []

  return (
    <div className="border-b last:border-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
      >
        <JobStatusBadge status={job.status} />
        <span className="flex-1 truncate text-sm font-medium">{job.target}</span>
        <span className="text-xs text-muted-foreground">
          {new Date(job.startedAt).toLocaleTimeString()}
        </span>
        {components.length > 0 && (
          <Badge variant="outline" className="text-[10px]">
            {components.length} components
          </Badge>
        )}
      </button>

      {expanded && (
        <div className="border-t bg-muted px-4 py-3 space-y-4">
          {logs.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Logs</p>
              <ScrollArea className="h-48">
                <pre className="text-xs font-mono space-y-0.5">
                  {logs.map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-muted-foreground select-none">$</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </pre>
              </ScrollArea>
            </div>
          )}

          {components.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Extracted Components ({components.length})
              </p>
              <div className="space-y-2">
                {components.map((comp, i) => (
                  <div key={i} className="rounded border bg-card px-3 py-2">
                    <p className="font-serif font-bold text-sm">{comp.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{comp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {job.status === "running" && logs.length === 0 && components.length === 0 && (
            <p className="text-xs text-muted-foreground">Waiting for results...</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const [registryUrl, setRegistryUrl] = useState("")
  const [jobs, setJobs] = useState<Job[]>([])

  const handleResult = (id: string, result: StagehandRunResult, status: JobStatus) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status, result } : j))
  }

  const dispatchScrape = async () => {
    const target = registryUrl.trim()
    if (!target) return
    setRegistryUrl("")

    const placeholder: Job = {
      id: crypto.randomUUID(),
      runId: "",
      target,
      status: "running",
      startedAt: new Date().toISOString(),
      result: null,
    }
    setJobs((prev) => [placeholder, ...prev])

    try {
      const { runId } = await runStagehand(target)
      setJobs((prev) => prev.map((j) => j.id === placeholder.id ? { ...j, runId } : j))
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setJobs((prev) =>
        prev.map((j) =>
          j.id === placeholder.id
            ? { ...j, status: "failed", result: { components: [], logs: [message] } }
            : j,
        ),
      )
    }
  }

  const running = jobs.filter((j) => j.status === "running").length
  const completed = jobs.filter((j) => j.status === "completed").length
  const totalComponents = jobs.reduce((acc, j) => acc + (j.result?.components.length ?? 0), 0)

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="text-primary hover:underline">Shadpedia</Link>
          <span className="mx-1">&gt;</span>
          <span className="text-foreground">Admin</span>
        </nav>

        <h1 className="font-serif text-3xl font-bold md:text-4xl">Admin Panel</h1>
        <p className="mt-2 text-muted-foreground">Dispatch scraping jobs and review extracted components.</p>

        <div className="mt-8 flex gap-3">
          <Input
            type="url"
            placeholder="Enter registry URL to scrape..."
            value={registryUrl}
            onChange={(e) => setRegistryUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && dispatchScrape()}
            className="flex-1"
          />
          <Button onClick={dispatchScrape} disabled={!registryUrl.trim()} className="gap-2">
            <Play className="h-4 w-4" />
            Scrape
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Jobs", value: jobs.length },
            { label: "Running", value: running },
            { label: "Components Found", value: totalComponents },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="font-serif text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="jobs" className="mt-8">
          <TabsList>
            <TabsTrigger value="jobs">
              Jobs {jobs.length > 0 && <span className="ml-1.5 text-xs">({jobs.length})</span>}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed {completed > 0 && <span className="ml-1.5 text-xs">({completed})</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-4">
            <Card>
              {jobs.length === 0 ? (
                <CardContent className="flex min-h-[180px] items-center justify-center text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">No jobs yet.</p>
                    <p className="mt-1 text-xs text-muted-foreground">Enter a URL above and hit Scrape.</p>
                  </div>
                </CardContent>
              ) : (
                jobs.map((job) => (
                  <JobRow key={job.id} job={job} onResult={handleResult} />
                ))
              )}
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <Card>
              {completed === 0 ? (
                <CardContent className="flex min-h-[180px] items-center justify-center text-center">
                  <p className="text-sm text-muted-foreground">No completed jobs yet.</p>
                </CardContent>
              ) : (
                jobs
                  .filter((j) => j.status === "completed")
                  .flatMap((j) => j.result?.components ?? [])
                  .map((comp, i) => (
                    <div key={i} className="border-b last:border-0 px-4 py-3">
                      <p className="font-serif font-bold">{comp.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{comp.description}</p>
                    </div>
                  ))
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
