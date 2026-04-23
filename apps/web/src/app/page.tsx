"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { useState } from "react"

import { Badge } from "@my-better-t-app/ui/components/badge"
import { Card, CardContent, CardHeader } from "@my-better-t-app/ui/components/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@my-better-t-app/ui/components/input-group"
import {
  Eyebrow,
  H1Hero,
  H2,
  H3,
  Label,
  Lead,
  Muted,
  Small,
} from "@my-better-t-app/ui/components/typography"

const FEATURED_COMPONENTS = [
  { name: "Button", slug: "button", source: "shadcn/ui", tags: ["form", "action"], description: "Displays a button or a component that looks like a button." },
  { name: "Dialog", slug: "dialog", source: "shadcn/ui", tags: ["overlay", "modal"], description: "A window overlaid on the primary window." },
  { name: "Data Table", slug: "data-table", source: "shadcn/ui", tags: ["data", "table"], description: "Powerful table with sorting, filtering, and pagination." },
  { name: "Bento Grid", slug: "bento-grid", source: "Aceternity UI", tags: ["layout", "grid"], description: "A beautiful bento-style grid layout component." },
  { name: "Command", slug: "command", source: "shadcn/ui", tags: ["search", "navigation"], description: "Fast, composable command menu." },
  { name: "Globe", slug: "globe", source: "Magic UI", tags: ["3d", "animation"], description: "An interactive 3D globe visualization." },
]

const CATEGORIES = [
  "Form Controls",
  "Data Display",
  "Navigation",
  "Overlays & Modals",
  "Layout",
  "Animation",
]

const RECENT_ADDITIONS = [
  { name: "Dock", slug: "dock", date: "22 March 2026" },
  { name: "Spotlight", slug: "spotlight", date: "21 March 2026" },
  { name: "Marquee", slug: "marquee", date: "20 March 2026" },
  { name: "Bento Grid", slug: "bento-grid", date: "19 March 2026" },
  { name: "Globe", slug: "globe", date: "18 March 2026" },
  { name: "Shimmer Button", slug: "shimmer-button", date: "17 March 2026" },
]

const STATISTICS = [
  { label: "Components indexed", value: "1,247" },
  { label: "Source libraries", value: "23" },
  { label: "Categories", value: "12" },
  { label: "Last updated", value: "22 Mar 2026" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-5xl px-4 pb-10 pt-12 text-center md:px-6 md:pb-14 md:pt-20">
        <H1Hero>The Component Encyclopedia</H1Hero>
        <Lead className="mx-auto mt-4 max-w-xl">
          Browse, discover, and install UI components from the best shadcn/ui libraries.
        </Lead>

        <div className="mx-auto mt-8 max-w-2xl">
          <InputGroup className="h-12 border-2 border-foreground focus-within:hard-shadow">
            <InputGroupAddon>
              <Search className="size-5" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-base"
            />
          </InputGroup>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 md:px-6">
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href="/browse"
              className="no-underline hover:no-underline"
            >
              <Badge
                variant="default"
                className="h-auto cursor-pointer border-2 border-foreground bg-foreground px-4 py-1.5 text-xs uppercase tracking-widest text-background transition-all hover:bg-background hover:text-foreground hover:hard-shadow"
              >
                {cat}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px]">
          <div>
            <H2>Featured Components</H2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {FEATURED_COMPONENTS.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/shad-components/${comp.slug}`}
                  className="no-underline hover:no-underline"
                >
                  <Card className="border-2 border-foreground ring-0 transition-all hover:hard-shadow">
                    <CardHeader>
                      <Eyebrow>{comp.source}</Eyebrow>
                      <H3 className="text-lg md:text-lg">{comp.name}</H3>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <Muted>{comp.description}</Muted>
                      <div className="flex flex-wrap gap-2">
                        {comp.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="border-foreground text-[10px] uppercase tracking-wider text-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <aside>
            <Card className="border-2 border-foreground ring-0">
              <CardHeader>
                <H3>Statistics</H3>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {STATISTICS.map((stat) => (
                    <div key={stat.label}>
                      <dt>
                        <Label>{stat.label}</Label>
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium text-foreground">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
        <H2>Recent Additions</H2>
        <ul className="mt-4 space-y-2">
          {RECENT_ADDITIONS.map((item) => (
            <li key={item.slug} className="flex items-baseline gap-2">
              <Link
                href={`/shad-components/${item.slug}`}
                className="font-medium text-primary hover:underline"
              >
                {item.name}
              </Link>
              <Small className="text-muted-foreground">— added {item.date}</Small>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
