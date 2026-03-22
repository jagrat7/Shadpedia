import { Link, createFileRoute } from "@tanstack/react-router"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/components/$slug")({
  component: ComponentDetailComponent,
})

const COMPONENTS = [
  { name: "Button", slug: "button", source: "shadcn/ui", tags: ["form", "action"], description: "Displays a button or a component that looks like a button.", install: "npx shadcn@latest add button", version: "1.0.0" },
  { name: "Dialog", slug: "dialog", source: "shadcn/ui", tags: ["overlay", "modal"], description: "A window overlaid on the primary window.", install: "npx shadcn@latest add dialog", version: "1.0.0" },
  { name: "Shimmer Button", slug: "shimmer-button", source: "Magic UI", tags: ["animation", "action"], description: "A button with a shimmering light effect.", install: "npx shadcn@latest add @magicui/shimmer-button", version: "0.2.0" },
  { name: "Data Table", slug: "data-table", source: "shadcn/ui", tags: ["data", "table"], description: "Powerful table with sorting, filtering, and pagination.", install: "npx shadcn@latest add table", version: "1.0.0" },
  { name: "Bento Grid", slug: "bento-grid", source: "Aceternity UI", tags: ["layout", "grid"], description: "A beautiful bento-style grid layout component.", install: "npx shadcn@latest add @aceternity/bento-grid", version: "0.1.0" },
  { name: "Globe", slug: "globe", source: "Magic UI", tags: ["3d", "animation"], description: "An interactive 3D globe visualization.", install: "npx shadcn@latest add @magicui/globe", version: "0.3.0" },
  { name: "Calendar", slug: "calendar", source: "shadcn/ui", tags: ["date", "form"], description: "A date field component with calendar popup.", install: "npx shadcn@latest add calendar", version: "1.0.0" },
  { name: "Marquee", slug: "marquee", source: "Magic UI", tags: ["animation", "text"], description: "An infinite scrolling marquee component.", install: "npx shadcn@latest add @magicui/marquee", version: "0.2.0" },
  { name: "Carousel", slug: "carousel", source: "shadcn/ui", tags: ["media", "layout"], description: "A carousel with motion and swipe gestures.", install: "npx shadcn@latest add carousel", version: "1.0.0" },
  { name: "Dock", slug: "dock", source: "Magic UI", tags: ["navigation", "animation"], description: "macOS-style dock with magnification effect.", install: "npx shadcn@latest add @magicui/dock", version: "0.1.0" },
  { name: "Command", slug: "command", source: "shadcn/ui", tags: ["search", "navigation"], description: "Fast, composable command menu.", install: "npx shadcn@latest add command", version: "1.0.0" },
  { name: "Spotlight", slug: "spotlight", source: "Aceternity UI", tags: ["effect", "hover"], description: "Spotlight effect that follows mouse cursor.", install: "npx shadcn@latest add @aceternity/spotlight", version: "0.1.0" },
]

const MOCK_PROPS = [
  { name: "variant", type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"', default: '"default"', description: "The visual style of the component." },
  { name: "size", type: '"default" | "sm" | "lg" | "icon"', default: '"default"', description: "The size of the component." },
  { name: "disabled", type: "boolean", default: "false", description: "Whether the component is disabled." },
  { name: "asChild", type: "boolean", default: "false", description: "Render as a child component using Slot." },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes to apply." },
]

type Tab = "preview" | "code" | "props"

function ComponentDetailComponent() {
  const { slug } = Route.useParams()
  const [activeTab, setActiveTab] = useState<Tab>("preview")
  const [copied, setCopied] = useState(false)

  const component = COMPONENTS.find((c) => c.slug === slug)

  if (!component) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center md:px-6">
        <h1 className="font-serif text-4xl font-bold text-foreground">Component Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The component &ldquo;{slug}&rdquo; could not be found in Shadpedia.
        </p>
        <Link
          to="/browse"
          className="mt-8 inline-block border-2 border-foreground bg-foreground px-6 py-2 text-sm font-semibold uppercase tracking-widest text-background transition-all hover:hard-shadow"
        >
          Back to Browse
        </Link>
      </main>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(component.install)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs: { key: Tab, label: string }[] = [
    { key: "preview", label: "Preview" },
    { key: "code", label: "Code" },
    { key: "props", label: "Props" },
  ]

  const componentImportName = component.name.replace(/\s/g, "")

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        {/* Breadcrumb + Back */}
        <nav className="mb-6 flex items-center gap-4">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse
          </Link>
          <span className="text-muted-foreground text-sm">
            / {component.name}
          </span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              {component.name}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {component.description}
            </p>

            {/* Tabs */}
            <div className="mt-8 flex border-b-2 border-foreground">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 text-sm font-semibold uppercase tracking-widest transition-colors ${
                    activeTab === tab.key
                      ? "border-b-2 border-foreground bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-0">
              {activeTab === "preview" && (
                <div className="border-2 border-t-0 border-foreground p-8 md:p-12">
                  <div className="flex min-h-[200px] items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-foreground bg-muted">
                        <span className="font-serif text-2xl font-bold text-foreground">
                          {component.name[0]}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Preview for {component.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Component preview would render here
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "code" && (
                <div className="border-2 border-t-0 border-foreground">
                  <div className="flex items-center justify-between border-b border-foreground/20 px-4 py-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Installation
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {copied ? (
                        <><Check className="h-3 w-3" /> Copied</>
                      ) : (
                        <><Copy className="h-3 w-3" /> Copy</>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto bg-muted p-6">
                    <code className="text-sm text-foreground">{component.install}</code>
                  </pre>
                  <div className="border-t border-foreground/20 p-6">
                    <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Usage
                    </span>
                    <pre className="overflow-x-auto bg-muted p-4">
                      <code className="text-sm text-foreground">{`import { ${componentImportName} } from "@/components/ui/${component.slug}"

export default function Example() {
  return <${componentImportName} />
}`}</code>
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === "props" && (
                <div className="border-2 border-t-0 border-foreground">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b-2 border-foreground">
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-foreground">
                            Prop
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-foreground">
                            Type
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-foreground">
                            Default
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-foreground">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_PROPS.map((prop) => (
                          <tr key={prop.name} className="border-b border-foreground/20">
                            <td className="px-4 py-3 font-mono text-sm font-semibold text-foreground">
                              {prop.name}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-accent">
                              {prop.type}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                              {prop.default}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {prop.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Sidebar */}
          <aside className="order-first lg:order-last">
            <div className="border-2 border-foreground bg-card p-6">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Metadata
              </h2>

              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Source
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {component.source}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Version
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {component.version}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Install
                  </dt>
                  <dd className="mt-1">
                    <code className="block break-all border border-foreground/20 bg-muted px-3 py-2 text-xs text-foreground">
                      {component.install}
                    </code>
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Tags
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {component.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-foreground bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background"
                      >
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handleCopy}
                className="mt-6 w-full border-2 border-foreground bg-foreground px-4 py-2.5 text-sm font-semibold uppercase tracking-widest text-background transition-all hover:hard-shadow"
              >
                {copied ? "Copied!" : "Copy Install Command"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
