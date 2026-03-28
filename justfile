set dotenv-load

# Run everything (web + api + inngest)
dev:
    bunx concurrently -n web,api,inngest -c blue,green,magenta "just web" "just api" "just inngest"

# Run Next.js dev server
web:
    bun run dev:web

# Run FastAPI dev server
api:
    cd apps/api && INNGEST_DEV=1 uv run fastapi dev main.py --port 8000

# Run Inngest dev server
inngest:
    bun inngest-cli dev -u http://localhost:8000/api/inngest

# Run web + api (no inngest)
dev-app:
    bunx concurrently -n web,api -c blue,green "just web" "just api"

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

# Start Postgres
db:
    docker compose up -d

# Stop Postgres
db-stop:
    docker compose down

# Install all dependencies
install:
    bun install
    cd apps/api && uv sync
