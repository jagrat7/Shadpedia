# Shadpedia

A way to easily search for amazing shadcn components.

Usally when I am building my frontend code I often find myself looking for shadcn components from sites below. It is a very time consuming process to find the right component, broswing through these sites. This project aims to solve that by providing a centralized search interface and previews of the components. 

### Sites like this ones

- [Triple D UI](https://ui.tripled.work/)
- [useLayouts](https://uselayouts.com/)
- [Vengence UI](https://www.vengenceui.com/)
- [Wigggle UI](https://wigggle-ui.vercel.app/)
- [Eldora UI](https://www.eldoraui.site/)


## Architecture
Next.js server actions + Vercel Workflows handle all logic. The crawler runs through Stagehand on Browserbase, with model calls routed through Vercel AI Gateway.

```mermaid
graph TD
    User["User"]

    subgraph App["Vercel App Layer"]
        Next["Next.js app<br/>UI + server actions + admin"]
        Workflow["Vercel Workflows<br/>[search, crawl & indexing jobs]"]
    end

    subgraph Data["Data Layer"]
        Postgres["Neon Postgres<br/>descriptions + vectors"]
    end

    subgraph Crawl["Browser Automation"]
        Stagehand["Stagehand"]
        Browserbase["Browserbase browsers"]
    end

    Gateway["Vercel AI Gateway<br/>  [embedding model & Stagehand model calls]"]

    User -->|search + admin actions| Next
    Next -->|read/write app data| Postgres
    Next -->|start workflow run| Workflow
    Workflow -->|run crawl steps| Stagehand
    Workflow <-->|create query embedding| Gateway
    Next -->|vector + string search| Postgres
    Stagehand -->|remote browser sessions| Browserbase
    Stagehand -->|generate descriptions via gateway| Gateway
    Workflow -->|store descriptions + vectors| Postgres

    style Next fill:#0070f3,color:#fff
    style Workflow fill:#0070f3,color:#fff
    style Postgres fill:#336791,color:#fff
    style Stagehand fill:#f59e0b,color:#fff
    style Browserbase fill:#f38020,color:#fff
    style Gateway fill:#10b981,color:#fff
```

### Data Flow

Two distinct paths: a hot search path and a durable background workflow pipeline.

**Search (latency-sensitive)**: User query → Next.js triggers a Vercel Workflow → AI Gateway creates the query embedding → Neon runs hybrid retrieval (vector search + string search) → reranker → ranked results.

**Workflows (durable background)**: Admin submits site in admin panel → Vercel Workflow starts → step 1 runs Stagehand on Browserbase, with its model calls routed through AI Gateway, to discover component URLs → one durable step per component fetches the component, has Stagehand generate a description, creates an embedding, and stores both in Neon for vector search. Each step is independently retriable and can resume cleanly if a browser task fails mid-crawl.

```mermaid
graph LR
    subgraph Workflows["Background Indexing (durable workflow)"]
        direction LR
        A["Admin adds site"] --> W["Vercel Workflow"] --> SH["Stagehand<br/>(Browserbase + AI Gateway)"] --> CL["Component list"] --> PS["Per-component step:<br/>generate description + embedding"] --> ST["Store in Neon<br/>for vector search"]
    end
    subgraph Search["User Search (latency-sensitive)"]
        direction LR
        Q["Query"] --> NS["Next.js"] --> SW["Vercel Workflow"] --> PG["Hybrid retrieval<br/>vector + string"] --> RR["Reranker"] --> R["Results"]
    end


    style Search fill:#f0fdf4,stroke:#16a34a
    style Workflows fill:#fef3c7,stroke:#d97706
```

## Project Structure

```
shadpedia/
├── apps/
│   ├── web/         # Next.js — UI, SSR, auth (Vercel)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── config/      # Shared TypeScript config
│   └── env/         # Shared env validation
```


## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
cd apps/web
&& bun run dev
```
