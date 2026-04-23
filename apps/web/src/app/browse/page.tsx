"use client"

import Link from "next/link"
import { useState } from "react"

const COMPONENTS = [
  { name: "Button", slug: "button", source: "shadcn/ui", tags: ["form", "action"], description: "Displays a button or a component that looks like a button.", install: "npx shadcn@latest add button" },
  { name: "Dialog", slug: "dialog", source: "shadcn/ui", tags: ["overlay", "modal"], description: "A window overlaid on the primary window.", install: "npx shadcn@latest add dialog" },
  { name: "Shimmer Button", slug: "shimmer-button", source: "Magic UI", tags: ["animation", "action"], description: "A button with a shimmering light effect.", install: "npx shadcn@latest add @magicui/shimmer-button" },
  { name: "Data Table", slug: "data-table", source: "shadcn/ui", tags: ["data", "table"], description: "Powerful table with sorting, filtering, and pagination.", install: "npx shadcn@latest add table" },
  { name: "Bento Grid", slug: "bento-grid", source: "Aceternity UI", tags: ["layout", "grid"], description: "A beautiful bento-style grid layout component.", install: "npx shadcn@latest add @aceternity/bento-grid" },
  { name: "Globe", slug: "globe", source: "Magic UI", tags: ["3d", "animation"], description: "An interactive 3D globe visualization.", install: "npx shadcn@latest add @magicui/globe" },
  { name: "Calendar", slug: "calendar", source: "shadcn/ui", tags: ["date", "form"], description: "A date field component with calendar popup.", install: "npx shadcn@latest add calendar" },
  { name: "Marquee", slug: "marquee", source: "Magic UI", tags: ["animation", "text"], description: "An infinite scrolling marquee component.", install: "npx shadcn@latest add @magicui/marquee" },
  { name: "Carousel", slug: "carousel", source: "shadcn/ui", tags: ["media", "layout"], description: "A carousel with motion and swipe gestures.", install: "npx shadcn@latest add carousel" },
  { name: "Dock", slug: "dock", source: "Magic UI", tags: ["navigation", "animation"], description: "macOS-style dock with magnification effect.", install: "npx shadcn@latest add @magicui/dock" },
  { name: "Command", slug: "command", source: "shadcn/ui", tags: ["search", "navigation"], description: "Fast, composable command menu.", install: "npx shadcn@latest add command" },
  { name: "Spotlight", slug: "spotlight", source: "Aceternity UI", tags: ["effect", "hover"], description: "Spotlight effect that follows mouse cursor.", install: "npx shadcn@latest add @aceternity/spotlight" },
]

const ALL_TAGS = [...new Set(COMPONENTS.flatMap((c) => c.tags))].sort()

export default function BrowsePage() {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag
    ? COMPONENTS.filter((c) => c.tags.includes(activeTag))
    : COMPONENTS

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-10 md:px-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="text-primary hover:underline">Shadpedia</Link>
          <span className="mx-1">&gt;</span>
          <span className="text-foreground">Browse</span>
        </nav>

        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
          Browse Components
        </h1>
        <p className="mt-2 text-muted-foreground">
          {COMPONENTS.length} components from the shadcn/ui ecosystem
        </p>

        {/* Filter Chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`border-2 border-foreground px-3 py-1 text-xs font-semibold uppercase tracking-widest transition-all ${
              activeTag === null
                ? "bg-foreground text-background"
                : "bg-background text-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            All
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`border-2 border-foreground px-3 py-1 text-xs font-semibold uppercase tracking-widest transition-all ${
                activeTag === tag
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Component Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((comp) => (
            <Link
              key={comp.slug}
              href={`/shad-components/${comp.slug}`}
              className="group flex flex-col border-2 border-foreground bg-card p-6 transition-all hover:hard-shadow no-underline"
            >
              <div className="mb-1 text-xs font-medium uppercase tracking-widest text-accent">
                {comp.source}
              </div>
              <h2 className="font-serif text-xl font-bold text-foreground">
                {comp.name}
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {comp.description}
              </p>
              <div className="mt-4">
                <code className="block border border-foreground/20 bg-muted px-3 py-1.5 text-xs text-foreground">
                  {comp.install}
                </code>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {comp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
