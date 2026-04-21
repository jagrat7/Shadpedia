# Shadpedia

A site that collects and condenses amazing shadcn component websites, providing a way to semantically search across all these open-source components. It aims to be the ultimate resource for developers looking for shadcn components. It will have the components rendered on the page but will ultimately link to the original source. It will use AI to create descriptions and tags for each component and then a rag system to power the search.
## Sites like this ones

- [Triple D UI](https://ui.tripled.work/)
- [useLayouts](https://uselayouts.com/)
- [Vengence UI](https://www.vengenceui.com/)
- [Wigggle UI](https://wigggle-ui.vercel.app/)
- [Eldora UI](https://www.eldoraui.site/)


## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Oxlint** - Oxlint + Oxfmt (linting & formatting)
- **PWA** - Progressive Web App support

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the fullstack application.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@my-better-t-app/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Git Hooks and Formatting

- Format and lint fix: `bun run check`

## Architecture

Full TypeScript stack. No separate backend service — Next.js server actions + Vercel Workflows handle all logic. The crawler (Stagehand) is self-hosted on a home PC and exposed to Vercel via a Cloudflare Tunnel.

```mermaid
graph TD
    Browser["Browser"]

    subgraph Vercel
        Next["Next.js (apps/web)<br/>UI, SSR, Admin, Server Actions"]
        Workflow["Vercel Workflows<br/>Durable ingest pipeline"]
        Gateway["Vercel AI Gateway<br/>LLM + embedding routing"]
    end

    subgraph Clerk
        Auth["Clerk<br/>Auth"]
    end

    subgraph Neon
        Postgres["Postgres + pgvector<br/>(Drizzle ORM)"]
    end

    subgraph Home["Home PC"]
        Stagehand["Stagehand<br/>Chromium + LLM browser agent"]
    end

    Tunnel["Cloudflare Tunnel"]
    Google["Google Gemini<br/>Flash + Embedding"]

    Browser -->|requests| Next
    Browser -->|sign in| Auth
    Next -->|Drizzle| Postgres
    Next -->|trigger| Workflow
    Workflow -->|HTTPS| Tunnel
    Tunnel --> Stagehand
    Workflow -->|describe + embed| Gateway
    Workflow -->|Drizzle| Postgres
    Next -->|embed query| Gateway
    Gateway --> Google

    style Next fill:#0070f3,color:#fff
    style Workflow fill:#0070f3,color:#fff
    style Gateway fill:#0070f3,color:#fff
    style Postgres fill:#336791,color:#fff
    style Stagehand fill:#f59e0b,color:#fff
    style Tunnel fill:#f38020,color:#fff
    style Auth fill:#6c47ff,color:#fff
    style Google fill:#4285f4,color:#fff
```

### Data Flow

Two distinct paths: a hot search path and a durable background ingest pipeline.

**Search (latency-sensitive)**: User query → Next.js server action → AI Gateway (Gemini embedding) → pgvector ANN search over components → ranked results.

**Ingest (durable background)**: Admin submits site in admin panel → Vercel Workflow starts → step 1 calls Stagehand on the home PC through the Cloudflare Tunnel to discover component URLs → one durable step per component fetches the component, generates a description (Gemini Flash) and an embedding (gemini-embedding-001), and upserts into Neon. Each step is independently retriable; if the PC is offline mid-crawl the workflow resumes when reachable.

```mermaid
graph LR
    subgraph Search["User Search (latency-sensitive)"]
        direction LR
        Q["Query"] --> NS["Next.js"] --> EG["AI Gateway<br/>embed"] --> PG["pgvector ANN"] --> R["Results"]
    end

    subgraph Ingest["Background Indexing (durable workflow)"]
        direction LR
        A["Admin adds site"] --> W["Vercel Workflow"] --> SH["Stagehand<br/>(home PC, via tunnel)"] --> CL["Component list"] --> PS["Per-component step:<br/>describe + embed"] --> ST["Upsert pgvector"]
    end

    style Search fill:#f0fdf4,stroke:#16a34a
    style Ingest fill:#fef3c7,stroke:#d97706
```

## Project Structure

```
shadpedia/
├── apps/
│   ├── web/         # Next.js — UI, SSR, auth (Vercel)
│   └── ai/          # FastAPI — API, DB, search, LLMs (Railway)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── config/      # Shared TypeScript config
│   └── env/         # Shared env validation
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check-types`: Check TypeScript types across all apps
- `bun run check`: Run Oxlint and Oxfmt
- `cd apps/web && bun run generate-pwa-assets`: Generate PWA assets
