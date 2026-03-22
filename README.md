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
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **PWA** - Progressive Web App support
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.

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

## Project Structure

```
my-better-t-app/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check-types`: Check TypeScript types across all apps
- `cd apps/web && bun run generate-pwa-assets`: Generate PWA assets
