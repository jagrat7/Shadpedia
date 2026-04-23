import { Check, RotateCw, X } from "lucide-react"
import { Badge } from "@my-better-t-app/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@my-better-t-app/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@my-better-t-app/ui/components/table"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@my-better-t-app/api/routers/index"
import type { StagehandRunResult } from "../../../../../packages/server/src/services/stagehand"

export type JobStatus = "running" | "completed" | "failed" | "cancelled"

export type Job = inferRouterOutputs<AppRouter>["spadmin"]["listJobs"][number]

const STATUS_VARIANT: Record<JobStatus, "default" | "secondary" | "destructive" | "outline"> = {
  running: "secondary",
  completed: "default",
  failed: "destructive",
  cancelled: "outline",
}

function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className="gap-1 uppercase text-[10px] tracking-widest shrink-0">
      {status === "running" && <RotateCw className="h-3 w-3 animate-spin" />}
      {status === "completed" && <Check className="h-3 w-3" />}
      {status === "failed" && <X className="h-3 w-3" />}
      {status}
    </Badge>
  )
}

function JobRow({
  job,
  selected,
  onSelect,
}: {
  job: Job
  selected: boolean
  onSelect: (id: string) => void
}) {
  const result = job.result as StagehandRunResult | null
  const components = result?.components ?? []

  return (
    <TableRow
      onClick={() => onSelect(job.id)}
      className={`cursor-pointer ${selected ? "bg-muted" : ""}`}
    >
      <TableCell><JobStatusBadge status={job.status} /></TableCell>
      <TableCell className="font-medium max-w-xs truncate">{job.target}</TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {new Date(job.startedAt).toLocaleTimeString()}
      </TableCell>
      <TableCell className="text-right">
        {components.length > 0 && (
          <Badge variant="outline" className="text-[10px]">
            {components.length} components
          </Badge>
        )}
      </TableCell>
    </TableRow>
  )
}

export function JobsTable({
  jobs,
  selectedJobId,
  onSelect,
}: {
  jobs: Job[]
  selectedJobId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Jobs {jobs.length > 0 && `(${jobs.length})`}
        </CardTitle>
      </CardHeader>
      {jobs.length === 0 ? (
        <CardContent className="flex min-h-[120px] items-center justify-center text-center">
          <div>
            <p className="text-sm text-muted-foreground">No jobs yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">Enter a URL above and hit Scrape.</p>
          </div>
        </CardContent>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Status</TableHead>
              <TableHead>Target</TableHead>
              <TableHead className="w-24">Started</TableHead>
              <TableHead className="w-32 text-right">Components</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                selected={selectedJobId === job.id}
                onSelect={onSelect}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
