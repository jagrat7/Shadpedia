"use client"

import { AlertCircle, ChevronDown, RotateCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@my-better-t-app/ui/components/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@my-better-t-app/ui/components/collapsible"
import { ScrollArea } from "@my-better-t-app/ui/components/scroll-area"
import type { Job } from "./jobs"

export function ComponentPreview({ job }: { job: Job | null }) {
  if (!job) {
    return (
      <Card>
        <CardContent className="flex min-h-[200px] items-center justify-center text-center">
          <p className="text-sm text-muted-foreground">Select a job to preview extracted components.</p>
        </CardContent>
      </Card>
    )
  }

  if (job.status === "running") {
    return (
      <Card>
        <CardContent className="flex min-h-[200px] items-center justify-center gap-2 text-center">
          <RotateCw className="h-4 w-4 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Job in progress...</p>
        </CardContent>
      </Card>
    )
  }

  if (job.status === "failed" || job.status === "cancelled") {
    return (
      <Card className="border-destructive/40">
        <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-center">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <p className="text-sm font-medium text-destructive">Job {job.status}</p>
          {job.errorMessage && (
            <p className="text-xs text-muted-foreground max-w-sm">{job.errorMessage}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  const components = job.result?.components ?? []
  const logs = job.result?.logs ?? []

  if (components.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[200px] items-center justify-center text-center">
          <p className="text-sm text-muted-foreground">No components extracted for this job.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Extracted Components ({components.length})
          </CardTitle>
        </CardHeader>
        <div className="divide-y">
          {components.map((comp, i) => (
            <div key={i} className="px-4 py-3 space-y-1">
              <p className="font-serif font-bold text-sm">{comp.name}</p>
              <p className="text-xs text-muted-foreground">{comp.description}</p>
              {comp.installCommand && (
                <code className="inline-block border border-border bg-muted px-2 py-0.5 text-xs font-mono text-foreground">
                  {comp.installCommand}
                </code>
              )}
            </div>
          ))}
        </div>
      </Card>

      {logs.length > 0 && (
        <Collapsible>
          <Card>
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Logs ({logs.length})
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform [[data-state=open]_&]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="px-4 pb-4 pt-0">
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
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  )
}