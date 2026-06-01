# Registry & Previews — Findings + Plan

> Date: 2026-06-01. Re-evaluates the Stagehand crawl pipeline.

## TL;DR

- All 5 target sites ship a **shadcn registry**. Component code can be pulled as
  structured JSON over HTTP — no browser crawl, no LLM extraction.
- **Browser automation moves from "extract code" → "capture previews."** That's its
  real strength; code extraction was the flaky part the registry replaces.
- **Don't install/host components ourselves.** Capture previews from each author's own
  (already-working) demo. Live interactive render is an optional later add.

## Finding 1 — registries exist (verified)

`GET /r/registry.json` returns 200 JSON on every site:

| Site | Endpoint | Items |
|---|---|---|
| Eldora UI | `/r/registry.json` | 115 |
| Triple D UI | `/r/registry.json` | ✅ |
| useLayouts | `/r/registry.json` | ✅ |
| Vengence UI | `/r/registry.json` | ✅ |
| Wigggle UI | `/r/registry.json` | ✅ |

Note: `/registry.json` (no `/r/`) only works on Eldora; `/r/registry.json` works on all.
Use `/r/registry.json` as the canonical endpoint.

### Shape
- **Index** (`/r/registry.json`) → `{ name, homepage, items: [...] }`. Each item:
  `name`, `title`, `description`, `dependencies`, `registryDependencies`, `files[].path`,
  `cssVars`, `type`. **No source code in the index.**
- **Per-item** (`/r/{name}.json`) → same metadata + `files[].content` = the real source
  (verified: 10KB `.tsx`).

### Why this beats the crawl
- Deterministic structured JSON vs flaky DOM + LLM extraction.
- Kills Browserbase sessions + extraction model calls (haiku / glm-5).
- One generic client handles all sites (standard spec) — DRY, no per-site hardcoding.

## Finding 2 — previews are the real problem

Two surfaces, two answers:

- **Search grid (many at once):** must be captured media. Can't live-render/iframe dozens
  of third-party components (CSP `frame-ancestors`/XFO blocks framing; perf dies).
- **Detail view (one):** room for live/interactive — optional.

### Decision: capture from the author's demo, at index time
- Authors already solved rendering — record their live demo, don't rebuild it.
- This is where **Stagehand stays useful**: AI-locate "the preview" across differing layouts.
- Format: **webp / mp4**, not GIF (GIF ~5–10× larger, 256 colors, ugly on gradient/blur
  components). Static screenshot only for non-animated items.
- Store in **Vercel Blob**, keyed `site/component/contentHash`. Re-capture only when the
  registry item hash changes (we fetch `registry.json` each run anyway → diff).

### Always include (cheap, high value)
- `npx shadcn add <item-url>` command + source view.

### Optional later — live "Live" tab in detail view
- Sandbox-render registry code (Sandpack / sandboxed iframe). Registry already gives
  `dependencies` + `registryDependencies` + `cssVars` + source, so tractable per-item.
- Expensive 20% serving the interactive 1% — defer until users ask.

## New pipeline

```
registry.json ──► fetch code (HTTP)         ──► store + embed
              └─► capture preview (browser)  ──► webp/mp4 in Vercel Blob
```

## Steps forward

1. **Build `services/registry/`** (folder + `index.ts` barrel — not a package).
   - `fetchRegistryIndex(siteBaseUrl)` → items.
   - `fetchRegistryItem(siteBaseUrl, name)` → item + source content.
   - Generic over any shadcn registry; sites configured as data, not code.
2. **Rewire the workflow**: replace `discoverStep → componentsStep` (Stagehand) with
   `fetchIndexStep → fetchItemsStep` (HTTP, parallel).
3. **Demote Stagehand to fallback** for sites without a registry. Keep, don't delete.
4. **Preview capture step**: for each item, record author demo → webp/mp4 → Vercel Blob,
   gated on item-hash diff.
5. **Open question to verify**: do sites expose per-component **isolated demo URLs** (vs a
   docs page with an embedded preview block)? Determines how clean capture is. Probe next.
6. **Description enrichment (optional)**: author descriptions are terse ("A safari browser
   component"). Consider an LLM pass for richer search text — now decoupled from extraction.
