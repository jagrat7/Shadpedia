"use client"

import { useCallback, useRef, useState } from "react"
import { runStagehand } from "./main"

type RunState = "idle" | "running" | "done" | "error"

export function StagehandEmbed() {
  const [state, setState] = useState<RunState>("idle")
  const [result, setResult] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const logEndRef = useRef<HTMLDivElement>(null)

  const startRun = useCallback(async () => {
    setState("running")
    setError(null)
    setResult(null)
    setLogs([])
    try {
      const { result: title, logs: runLogs } = await runStagehand()
      setResult(title ?? null)
      setLogs(runLogs)
      setState("done")
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setState("error")
    }
  }, [])

  return (
    <div className="mt-6 flex flex-col gap-3">
      <button
        type="button"
        onClick={startRun}
        disabled={state === "running"}
        className="inline-flex w-fit items-center gap-2 border-2 border-foreground bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-widest text-background transition-all hover:hard-shadow disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {state === "running" ? "Running..." : "Run Stagehand (Local)"}
      </button>
      {result && (
        <p className="text-sm font-medium text-foreground">Result: {result}</p>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {logs.length > 0 && (
        <div className="max-h-64 overflow-y-auto border-2 border-foreground bg-muted p-3 font-mono text-xs text-foreground">
          {logs.map((line, i) => (
            <div key={i} className="py-0.5 whitespace-pre-wrap">{line}</div>
          ))}
          <div ref={logEndRef} />
        </div>
      )}
    </div>
  )
}