import { TaggedError } from "better-result"


export class DiscoverNavigationError extends TaggedError("DiscoverNavigationError")<{
  url: string
  message: string
}>() {}

export class DiscoverExtractionError extends TaggedError("DiscoverExtractionError")<{
  message: string
}>() {}

export class DiscoverLinkValidationError extends TaggedError("DiscoverLinkValidationError")<{
  raw: string
  normalized: string
  basePath: string
  message: string
}>() {}

export type DiscoverError = DiscoverNavigationError | DiscoverExtractionError | DiscoverLinkValidationError
