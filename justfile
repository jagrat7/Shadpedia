set dotenv-load

# Run everything (web + api + inngest)
dev:
    just web & just api & just inngest & wait

# Run Next.js dev server
web:
    bun run dev:web

# Run FastAPI dev server
api:
    cd apps/api && INNGEST_DEV=1 uv run fastapi dev main.py --port 8000

# Run Inngest dev server
inngest:
    npx inngest-cli@latest dev

# Run web + api (no inngest)
dev-app:
    just web & just api & wait

# Format all
fmt:
    bun run check
    cd apps/api && uv run ruff format src

# Lint api
lint-api:
    cd apps/api && uv run ruff check src

# Run alembic migration
migrate:
    cd apps/api && uv run alembic upgrade head

# Create a new alembic migration
migration name:
    cd apps/api && uv run alembic revision --autogenerate -m "{{name}}"

# Install all dependencies
install:
    bun install
    cd apps/api && uv sync
