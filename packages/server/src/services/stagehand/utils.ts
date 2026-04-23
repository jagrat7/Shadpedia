import type { LogLine } from "@browserbasehq/stagehand"
import pino, { type DestinationStream, type Level, type Logger } from "pino"

const STAGEHAND_LEVEL_TO_PINO: Record<NonNullable<LogLine["level"]>, Level> = {
  0: "error",
  1: "info",
  2: "debug",
}

const ANSI_RESET = "\u001B[0m"
const LEVEL_COLORS: Record<Level, string> = {
  fatal: "\u001B[35m",
  error: "\u001B[31m",
  warn: "\u001B[33m",
  info: "\u001B[36m",
  debug: "\u001B[90m",
  trace: "\u001B[34m",
}

function colorizeLevel(level: Level, text: string) {
  const color = LEVEL_COLORS[level]

  return color ? `${color}${text}${ANSI_RESET}` : text
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
        const { level = "info", msg, time } = JSON.parse(chunk) as {
          level?: Level
          msg: string
          time: number
        }
        const levelLabel = colorizeLevel(level, `[${level.toUpperCase()}]`)
        const line = `[${new Date(time).toLocaleTimeString()}] [${level.toUpperCase()}] ${msg}`
        logs.push(line)
        console.log(`[${new Date(time).toLocaleTimeString()}] ${levelLabel} ${msg}`)
      } catch {
        const line = chunk.trim()
        logs.push(line)
        console.log(line)
      }
    },
  }

  const logger = pino(
    {
      level: "debug",
      formatters: {
        level: (label) => ({ level: label }),
      },
    },
    destination,
  )

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
