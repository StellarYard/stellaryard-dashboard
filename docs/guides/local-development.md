# Local Development Guide

How to set up a development environment for contributing to StellarYard.

## Prerequisites

- Go 1.22+
- Node.js 18+
- Docker and Docker Compose
- Git

## Setting Up All Three Repos

```bash
# Create workspace
mkdir stellaryard-dev && cd stellaryard-dev

# Clone all repos
git clone https://github.com/StellarYard/stellaryard-core.git
git clone https://github.com/StellarYard/stellaryard-cli.git
git clone https://github.com/StellarYard/stellaryard-dashboard.git
```

## Developing stellaryard-core

```bash
cd stellaryard-core

# Install dependencies
go mod tidy

# Start Docker containers
docker compose up -d

# Run the server
go run cmd/server/main.go

# In another terminal: run tests
go test ./...
```

### Core Development Tips

- The API is at `http://localhost:8080/api/v1`
- Use `curl` or the CLI to test endpoints
- Check Docker logs: `docker compose logs -f`
- SQLite database is at `./stellaryard.db`

## Developing stellaryard-cli

```bash
cd stellaryard-cli

# Install dependencies
go mod tidy

# Build
go build -o stellaryard ./cmd/stellaryard

# Run (core must be running)
./stellaryard --help

# Run tests
go test ./...
```

### CLI Development Tips

- Use `--verbose` for debug output
- Test with `--format json` to verify machine-readable output
- Check exit codes: `echo $?` after running a command

## Developing stellaryard-dashboard

```bash
cd stellaryard-dashboard

# Install dependencies
npm install

# Start dev server (core must be running)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Dashboard Development Tips

- Dev server runs at `http://localhost:5173`
- API requests are proxied to core via Vite
- Use React DevTools for debugging
- Check browser console for API errors

## Testing Across Repos

The most common integration test flow:

1. Start core: `cd stellaryard-core && go run cmd/server/main.go`
2. Test with CLI: `cd stellaryard-cli && ./stellaryard containers status`
3. Test with dashboard: `cd stellaryard-dashboard && npm run dev`

## Troubleshooting

### Docker not running

```
Error: Cannot connect to the Docker daemon
```

Start Docker Desktop or: `sudo systemctl start docker`

### Port already in use

```
Error: listen tcp :8080: bind: address already in use
```

Kill the process: `lsof -ti:8080 | xargs kill -9`

### Go module errors

```
go: module not found
```

Run: `go mod tidy`

### npm install fails

```
npm ERR! peer dep
```

Try: `npm install --legacy-peer-deps`
