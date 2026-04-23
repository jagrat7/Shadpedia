"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Play } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@my-better-t-app/ui/components/breadcrumb"
import { Card, CardContent, CardHeader } from "@my-better-t-app/ui/components/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@my-better-t-app/ui/components/input-group"
import { H1, H2, H3, Label, Lead } from "@my-better-t-app/ui/components/typography"
import { trpc, queryClient } from "@/utils/trpc"

import { JobsTable } from "./jobs-table"
import { ComponentPreview } from "./component-preview"

const JOBS_REFETCH_INTERVAL_MS = 3000

export default function AdminPage() {
  const [registryUrl, setRegistryUrl] = useState("")
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const jobsQueryOptions = trpc.spadmin.listJobs.queryOptions(undefined, {
    refetchInterval: (query) => {
      const jobs = query.state.data ?? []
      return jobs.some((job) => job.status === "running") ? JOBS_REFETCH_INTERVAL_MS : false
    },
  })
  const jobsQuery = useQuery(jobsQueryOptions)
  const createJob = useMutation(trpc.spadmin.createJob.mutationOptions({
    onSuccess: (job) => {
      setSelectedJobId(job.id)
      queryClient.invalidateQueries({
        queryKey: jobsQueryOptions.queryKey,
      })
    },
  }))

  const jobs = jobsQuery.data ?? []

  const dispatchScrape = async () => {
    const target = registryUrl.trim()
    if (!target) return
    setRegistryUrl("")

    await createJob.mutateAsync({ target })
  }

  useEffect(() => {
    if (!selectedJobId && jobs.length > 0) {
      setSelectedJobId(jobs[0].id)
    }
  }, [jobs, selectedJobId])

  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null
  const running = jobs.filter((j) => j.status === "running").length
  const totalComponents = jobs.reduce((acc, j) => acc + (j.result?.components.length ?? 0), 0)

  const stats = [
    { label: "Total jobs", value: jobs.length },
    { label: "Running", value: running },
    { label: "Components found", value: totalComponents },
  ]

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Shadpedia</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Admin</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <H1>Admin Panel</H1>
        <Lead className="mt-2 max-w-xl">Dispatch scraping jobs and review extracted components.</Lead>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-8">
            <InputGroup className="h-11 border-2 border-foreground focus-within:hard-shadow">
              <InputGroupInput
                type="url"
                placeholder="Enter registry URL to scrape..."
                value={registryUrl}
                onChange={(e) => setRegistryUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && dispatchScrape()}
                className="text-sm"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="sm"
                  variant="default"
                  onClick={dispatchScrape}
                  disabled={!registryUrl.trim() || createJob.isPending}
                  className="gap-1.5"
                >
                  <Play className={createJob.isPending ? "size-3.5 animate-pulse" : "size-3.5"} />
                  Scrape
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            <section className="space-y-4">
              <H2 className="text-xl md:text-2xl">Scraping runs</H2>
              <JobsTable
                jobs={jobs}
                selectedJobId={selectedJobId}
                onSelect={setSelectedJobId}
              />
              <ComponentPreview job={selectedJob} />
            </section>
          </div>

          <aside>
            <Card className="border-2 border-foreground ring-0">
              <CardHeader>
                <H3>Run summary</H3>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <dt>
                        <Label>{stat.label}</Label>
                      </dt>
                      <dd className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}
