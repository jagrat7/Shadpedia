set dotenv-load

# Run web app
dev:
    just web

# Run Next.js dev server
web:
    bun run dev:web

web-add +deps:
    cd apps/web && bun add {{deps}}

web-add-dev +deps:
    cd apps/web && bun add -d {{deps}}

ui-add +deps:
    cd packages/ui && bun add {{deps}}

ui-add-dev +deps:
    cd packages/ui && bun add -d {{deps}}

ui +args:
    cd packages/ui && bunx shadcn@latest {{args}}

# Format all
fmt:
    bun run check

# Start Postgres
db:
    docker compose up -d

# Stop Postgres
db-stop:
    docker compose down

# Install all dependencies
install:
    bun install
