"use client"

import { useState } from "react"
import Link from "next/link"
import { Play, RotateCw, Check, X, Clock } from "lucide-react"
import { runStagehand } from "./main"

type JobStatus = "idle" | "running" | "completed" | "failed"

interface Job {
  id: string
  type: "scrape" | "analyse"
  target: string
  status: JobStatus
  startedAt: string | null
  output: string[]
}

interface ScrapedComponent {
  id: string
  name: string
  source: string
  slug: string
  description: string
  tags: string[]
  install: string
  status: "pending" | "approved" | "rejected"
}

const STATUS_STYLES: Record<JobStatus, string> = {
  idle: "bg-muted text-muted-foreground",
  running: "bg-accent/20 text-accent",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const COMPONENT_STATUS_STYLES: Record<ScrapedComponent["status"], string> = {
  pending: "border-foreground text-foreground",
  approved: "border-green-700 bg-green-700 text-background",
  rejected: "border-red-700 bg-red-700 text-background",
}

export default function AdminPage() {
  const [registryUrl, setRegistryUrl] = useState("")
  const [jobs, setJobs] = useState<Job[]>([])
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [scrapedComponents, setScrapedComponents] = useState<ScrapedComponent[]>([])
  const [activeTab, setActiveTab] = useState<"jobs" | "components">("jobs")

  const dispatchScrape = async () => {
    const targetUrl = registryUrl.trim()

    if (!targetUrl) return

    const job: Job = {
      id: crypto.randomUUID(),
      type: "scrape",
      target: targetUrl,
      status: "running",
      startedAt: new Date().toISOString(),
      output: [`Scraping ${targetUrl}...`],
    }

    setJobs((prev) => [job, ...prev])
    setRegistryUrl("")

    try {
      const { runId } = await runStagehand(targetUrl)

      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? {
                ...j,
                status: "completed",
                output: [...j.output, `Workflow started (runId: ${runId})`],
              }
            : j,
        ),
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)

      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? {
                ...j,
                status: "failed",
                output: [...j.output, message],
              }
            : j,
        ),
      )
    }
  }

  const dispatchAnalyse = () => {
    const pendingCount = scrapedComponents.filter((c) => c.status === "pending").length
    if (pendingCount === 0) return

    const job: Job = {
      id: crypto.randomUUID(),
      type: "analyse",
      target: `${pendingCount} pending components`,
      status: "running",
      startedAt: new Date().toISOString(),
      output: [`Analysing ${pendingCount} components...`],
    }

    setJobs((prev) => [job, ...prev])

    // TODO: dispatch inngest event via API
    // POST /api/inngest/send { name: "components/analyse", data: { componentIds: [...] } }

    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? {
                ...j,
                status: "completed",
                output: [
                  ...j.output,
                  "Checking dependencies...",
                  "Validating install commands...",
                  "Categorising components...",
                  `Done — ${pendingCount} components analysed`,
                ],
              }
            : j,
        ),
      )
    }, 1500)
  }

  const updateComponentStatus = (id: string, status: ScrapedComponent["status"]) => {
    setScrapedComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    )
  }

  const approveAll = () => {
    setScrapedComponents((prev) =>
      prev.map((c) => (c.status === "pending" ? { ...c, status: "approved" } : c)),
    )
  }

  const tabs = [
    { key: "jobs" as const, label: "Jobs", count: jobs.length },
    { key: "components" as const, label: "Components", count: scrapedComponents.length },
  ]

  const pendingCount = scrapedComponents.filter((c) => c.status === "pending").length
  const approvedCount = scrapedComponents.filter((c) => c.status === "approved").length

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="text-primary hover:underline">Shadpedia</Link>
          <span className="mx-1">&gt;</span>
          <span className="text-foreground">Admin</span>
        </nav>

        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
          Admin Panel
        </h1>
        <p className="mt-2 text-muted-foreground">
          Dispatch scraping jobs, review outputs, and finalize components.
        </p>
        {/* Dispatch Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <input
              type="url"
              placeholder="Enter registry URL to scrape..."
              value={registryUrl}
              onChange={(e) => setRegistryUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && dispatchScrape()}
              className="w-full border-2 border-foreground bg-background py-3 pl-4 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:hard-shadow"
            />
          </div>
          <button
            type="button"
            onClick={dispatchScrape}
            disabled={!registryUrl.trim()}
            className="inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-6 py-3 text-sm font-semibold uppercase tracking-widest text-background transition-all hover:hard-shadow disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4" />
            Scrape
          </button>
          <button
            type="button"
            onClick={dispatchAnalyse}
            disabled={pendingCount === 0}
            className="inline-flex items-center gap-2 border-2 border-foreground bg-background px-6 py-3 text-sm font-semibold uppercase tracking-widest text-foreground transition-all hover:hard-shadow disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCw className="h-4 w-4" />
            Analyse ({pendingCount})
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex border-b-2 border-foreground">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-semibold uppercase tracking-widest transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-foreground bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 text-xs">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="border-2 border-t-0 border-foreground">
            {jobs.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    No jobs dispatched yet.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter a registry URL above and hit Scrape.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-foreground/20">
                {jobs.map((job) => (
                  <div key={job.id}>
                    <button
                      type="button"
                      onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                      className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <span className={`inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[job.status]}`}>
                        {job.status === "running" && <RotateCw className="h-3 w-3 animate-spin" />}
                        {job.status === "completed" && <Check className="h-3 w-3" />}
                        {job.status === "failed" && <X className="h-3 w-3" />}
                        {job.status === "idle" && <Clock className="h-3 w-3" />}
                        {job.status}
                      </span>
                      <span className="border border-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                        {job.type}
                      </span>
                      <span className="flex-1 truncate text-sm text-foreground">
                        {job.target}
                      </span>
                      {job.startedAt && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(job.startedAt).toLocaleTimeString()}
                        </span>
                      )}
                    </button>
                    {expandedJob === job.id && (
                      <div className="border-t border-foreground/20 bg-muted p-4">
                        <pre className="overflow-x-auto text-xs text-foreground">
                          {job.output.map((line, i) => (
                            <div key={i} className="py-0.5">
                              <span className="text-muted-foreground mr-2">$</span>
                              {line}
                            </div>
                          ))}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Components Tab */}
        {activeTab === "components" && (
          <div className="border-2 border-t-0 border-foreground">
            {scrapedComponents.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    No components scraped yet.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Dispatch a scrape job to discover components.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Toolbar */}
                <div className="flex items-center justify-between border-b border-foreground/20 px-4 py-2">
                  <span className="text-xs text-muted-foreground">
                    {pendingCount} pending · {approvedCount} approved · {scrapedComponents.length - pendingCount - approvedCount} rejected
                  </span>
                  {pendingCount > 0 && (
                    <button
                      type="button"
                      onClick={approveAll}
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:text-accent"
                    >
                      <Check className="h-3 w-3" />
                      Approve All
                    </button>
                  )}
                </div>

                <div className="divide-y divide-foreground/20">
                  {scrapedComponents.map((comp) => (
                    <div key={comp.id} className="flex items-start gap-4 px-4 py-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg font-bold text-foreground">
                            {comp.name}
                          </h3>
                          <span className={`border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${COMPONENT_STATUS_STYLES[comp.status]}`}>
                            {comp.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {comp.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-xs font-medium uppercase tracking-widest text-accent">
                            {comp.source}
                          </span>
                          <code className="border border-foreground/20 bg-muted px-2 py-0.5 text-xs text-foreground">
                            {comp.install}
                          </code>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {comp.tags.map((tag) => (
                            <span
                              key={tag}
                              className="border border-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {comp.status === "pending" && (
                        <div className="flex shrink-0 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => updateComponentStatus(comp.id, "approved")}
                            className="inline-flex items-center gap-1 border-2 border-foreground bg-foreground px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-background transition-all hover:hard-shadow"
                          >
                            <Check className="h-3 w-3" />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => updateComponentStatus(comp.id, "rejected")}
                            className="inline-flex items-center gap-1 border-2 border-foreground bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground transition-all hover:hard-shadow"
                          >
                            <X className="h-3 w-3" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Stats Sidebar */}
        <div className="mt-10 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total Jobs", value: jobs.length },
            { label: "Running", value: jobs.filter((j) => j.status === "running").length },
            { label: "Components Found", value: scrapedComponents.length },
            { label: "Pending Review", value: pendingCount },
          ].map((stat) => (
            <div key={stat.label} className="border-2 border-foreground bg-card p-4">
              <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="mt-1 font-serif text-2xl font-bold text-foreground">
                {stat.value}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
