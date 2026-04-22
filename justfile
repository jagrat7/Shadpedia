set dotenv-load

# Run web app
dev:
    just web

# Run Next.js dev server
web:
    bun run dev:web

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
