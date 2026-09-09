# Troubleshooting

Common issues and how to fix them.

## Core Issues

### Docker not running

**Error**: `Cannot connect to the Docker daemon`

**Fix**:
```bash
# Linux
sudo systemctl start docker

# macOS
# Start Docker Desktop
```

### Port already in use

**Error**: `listen tcp :8080: bind: address already in use`

**Fix**:
```bash
# Find what's using the port
lsof -ti:8080

# Kill it
kill -9 $(lsof -ti:8080)
```

### Database locked

**Error**: `database is locked`

**Fix**: Stop all core instances and remove the lock file:
```bash
rm -f stellaryard.db-wal stellaryard.db-shm
```

## CLI Issues

### Core unreachable (exit code 2)

**Error**: `cannot reach stellaryard-core at http://localhost:8080`

**Fix**:
1. Verify core is running: `curl http://localhost:8080/health`
2. Check the port: `--core-url http://localhost:8080`
3. Check Docker: `docker ps`

### Wrong exit code

If you get exit code 1 instead of 2 or 3:
- Exit 1 = argument error (check your flags)
- Exit 2 = core unreachable (start core)
- Exit 3 = application error (check core logs)

## Dashboard Issues

### CORS errors

**Error**: `Access-Control-Allow-Origin` missing

**Fix**: Core must be running with CORS enabled. Verify:
```bash
curl -I -X OPTIONS http://localhost:8080/api/v1/containers
```

### Blank page

**Error**: Dashboard shows blank screen

**Fix**:
1. Check browser console for errors
2. Verify core is running
3. Check `VITE_API_URL` environment variable

### WebSocket connection failed

**Error**: Logs not streaming

**Fix**:
1. Verify core is running
2. Check if container is running: `./stellaryard containers status`
3. Try re-connecting (WebSocket may have timed out)

## General

### How to reset everything

```bash
# Stop all containers
docker compose down

# Remove database
rm -f stellaryard.db*

# Start fresh
docker compose up -d
go run cmd/server/main.go
```

### Where are the logs?

- Core: stdout (terminal output)
- Docker containers: `docker compose logs -f`
- Dashboard: browser developer console

### Getting help

- [GitHub Issues](https://github.com/StellarYard/stellaryard-core/issues)
- [GitHub Discussions](https://github.com/StellarYard/stellaryard-core/discussions)
