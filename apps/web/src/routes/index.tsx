import { Link, createFileRoute } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/")({
  component: HomeComponent,
})

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

function HomeComponent() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-10 pt-12 text-center md:px-6 md:pb-14 md:pt-20">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          The Component Encyclopedia
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Browse, discover, and install UI components from the best shadcn/ui libraries.
        </p>

        {/* Search */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-foreground bg-background py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:hard-shadow"
            />
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="mx-auto max-w-5xl px-4 pb-10 md:px-6">
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to="/browse"
              className="border-2 border-foreground bg-foreground px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-background transition-all hover:bg-background hover:text-foreground hover:hard-shadow cursor-pointer"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Two-column: Featured Cards + Infobox */}
      <section className="mx-auto max-w-5xl px-4 pb-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
          {/* Featured Component Cards */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              Featured Components
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {FEATURED_COMPONENTS.map((comp) => (
                <Link
                  key={comp.slug}
                  to="/components/$slug"
                  params={{ slug: comp.slug }}
                  className="group border-2 border-foreground bg-card p-5 transition-all hover:hard-shadow"
                >
                  <div className="mb-1 text-xs font-medium uppercase tracking-widest text-accent">
                    {comp.source}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {comp.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {comp.description}
                  </p>
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
          </div>

          {/* Statistics Infobox */}
          <aside>
            <div className="border-2 border-foreground bg-card p-5">
              <h3 className="font-serif text-lg font-bold text-foreground">
                Statistics
              </h3>
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Components indexed
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-foreground">1,247</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Source libraries
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-foreground">23</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Categories
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-foreground">12</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Last updated
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-foreground">22 Mar 2026</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* Recent Additions */}
      <section className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
        <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
          Recent Additions
        </h2>
        <ul className="mt-4 space-y-2">
          {RECENT_ADDITIONS.map((item) => (
            <li key={item.slug} className="flex items-baseline gap-2 text-sm">
              <Link
                to="/components/$slug"
                params={{ slug: item.slug }}
                className="font-medium text-primary hover:underline cursor-pointer"
              >
                {item.name}
              </Link>
              <span className="text-muted-foreground">— added {item.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
