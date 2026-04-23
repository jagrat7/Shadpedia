import * as React from "react"

import { cn } from "@my-better-t-app/ui/lib/utils"

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>
type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>
type QuoteProps = React.HTMLAttributes<HTMLQuoteElement>
type ListProps = React.HTMLAttributes<HTMLUListElement>
type CodeProps = React.HTMLAttributes<HTMLElement>
type SpanProps = React.HTMLAttributes<HTMLSpanElement>

function H1({ className, ...props }: HeadingProps) {
  return (
    <h1
      className={cn(
        "font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl",
        className,
      )}
      {...props}
    />
  )
}

function H1Hero({ className, ...props }: HeadingProps) {
  return (
    <h1
      className={cn(
        "font-serif text-4xl font-bold tracking-tight text-foreground md:text-6xl",
        className,
      )}
      {...props}
    />
  )
}

function H2({ className, ...props }: HeadingProps) {
  return (
    <h2
      className={cn(
        "font-serif text-2xl font-bold text-foreground first:mt-0 md:text-3xl",
        className,
      )}
      {...props}
    />
  )
}

function H3({ className, ...props }: HeadingProps) {
  return (
    <h3
      className={cn(
        "font-serif text-lg font-bold text-foreground md:text-xl",
        className,
      )}
      {...props}
    />
  )
}

function H4({ className, ...props }: HeadingProps) {
  return (
    <h4
      className={cn("font-serif text-base font-bold text-foreground", className)}
      {...props}
    />
  )
}

function P({ className, ...props }: ParagraphProps) {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-4", className)}
      {...props}
    />
  )
}

function Lead({ className, ...props }: ParagraphProps) {
  return (
    <p
      className={cn("text-lg text-muted-foreground", className)}
      {...props}
    />
  )
}

function Large({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-lg font-semibold", className)} {...props} />
  )
}

function Small({ className, ...props }: SpanProps) {
  return (
    <small
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
}

function Muted({ className, ...props }: ParagraphProps) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function Blockquote({ className, ...props }: QuoteProps) {
  return (
    <blockquote
      className={cn(
        "mt-6 border-y-2 border-foreground bg-muted/40 px-4 py-3 font-serif italic",
        className,
      )}
      {...props}
    />
  )
}

function List({ className, ...props }: ListProps) {
  return (
    <ul
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  )
}

function InlineCode({ className, ...props }: CodeProps) {
  return (
    <code
      className={cn(
        "border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
        className,
      )}
      {...props}
    />
  )
}

function Label({ className, ...props }: SpanProps) {
  return (
    <span
      className={cn(
        "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

function Eyebrow({ className, ...props }: SpanProps) {
  return (
    <span
      className={cn(
        "text-xs font-medium uppercase tracking-widest text-accent",
        className,
      )}
      {...props}
    />
  )
}

export {
  H1,
  H1Hero,
  H2,
  H3,
  H4,
  P,
  Lead,
  Large,
  Small,
  Muted,
  Blockquote,
  List,
  InlineCode,
  Label,
  Eyebrow,
}
