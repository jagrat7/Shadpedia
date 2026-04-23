"use client"

import { useState } from "react"
import Link from "next/link"
import { Play } from "lucide-react"
import { Button } from "@my-better-t-app/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@my-better-t-app/ui/components/card"
import { Input } from "@my-better-t-app/ui/components/input"

import { runStagehand } from "./main"
import { JobsTable, type Job, type JobStatus } from "./jobs"
import { ComponentPreview } from "./component-preview"
import type { StagehandRunResult } from "../../server/stagehand"





export default function AdminPage() {
  const [registryUrl, setRegistryUrl] = useState("")
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const handleResult = (id: string, result: StagehandRunResult | null, status: JobStatus, errorMessage: string | null) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status, result, errorMessage } : j))
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
      errorMessage: null,
    }
    setJobs((prev) => [placeholder, ...prev])
    setSelectedJobId(placeholder.id)

    try {
      const { runId } = await runStagehand(target)
      setJobs((prev) => prev.map((j) => j.id === placeholder.id ? { ...j, runId } : j))
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setJobs((prev) =>
        prev.map((j) =>
          j.id === placeholder.id
            ? { ...j, status: "failed", errorMessage: message }
            : j,
        ),
      )
    }
  }

  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null
  const running = jobs.filter((j) => j.status === "running").length
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

        <div className="mt-8 space-y-4">
          <JobsTable
            jobs={jobs}
            selectedJobId={selectedJobId}
            onSelect={setSelectedJobId}
            onResult={handleResult}
          />
          <ComponentPreview job={selectedJob} />
        </div>
      </div>
    </main>
  )
}
