import type { LogLine } from "@browserbasehq/stagehand"
import pino, { type DestinationStream, type Level, type Logger } from "pino"

const STAGEHAND_LEVEL_TO_PINO: Record<NonNullable<LogLine["level"]>, Level> = {
  0: "error",
  1: "info",
  2: "debug",
}

export function stringifyLogAuxiliary(logLine: LogLine) {
  if (!logLine.auxiliary) {
    return ""
  }

  return Object.entries(logLine.auxiliary)
    .map(([key, item]) => `${key}=${item.value}`)
    .join(" | ")
}

export function formatStagehandLog(logLine: LogLine) {
  const parts = [logLine.category ? `[${logLine.category}]` : null, logLine.message]
  const auxiliary = stringifyLogAuxiliary(logLine)

  if (auxiliary) {
    parts.push(auxiliary)
  }

  return parts.filter(Boolean).join(" ")
}

export type RunLogger = {
  logger: Logger
  logs: string[]
  info: (msg: string) => void
  handleStagehandLog: (logLine: LogLine) => void
}

export function createRunLogger(): RunLogger {
  const logs: string[] = []

  const destination: DestinationStream = {
    write(chunk: string) {
      try {
        const { time, msg } = JSON.parse(chunk) as { time: number; msg: string }
        const line = `[${new Date(time).toLocaleTimeString()}] ${msg}`
        logs.push(line)
        console.log(line)
      } catch {
        const line = chunk.trim()
        logs.push(line)
        console.log(line)
      }
    },
  }

  const logger = pino({ level: "debug" }, destination)

  return {
    logger,
    logs,
    info: (msg) => logger.info(msg),
    handleStagehandLog: (logLine) => {
      const level = STAGEHAND_LEVEL_TO_PINO[logLine.level ?? 1] ?? "info"
      logger[level](formatStagehandLog(logLine))
    },
  }
}
