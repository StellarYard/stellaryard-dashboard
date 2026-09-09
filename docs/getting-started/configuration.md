# Configuration

StellarYard uses sensible defaults. Here's how to customize your setup.

## Core Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `STELLARYARD_PORT` | `8080` | API server port |
| `STELLARYARD_DB_PATH` | `./stellaryard.db` | SQLite database path |
| `DOCKER_HOST` | Unix socket | Docker daemon connection |

### Docker Compose

The `docker-compose.yml` in `stellaryard-core` configures:

```yaml
services:
  horizon:
    image: stellar/quickstart:testing
    ports:
      - "8000:8000"    # Horizon API
    command: ["--standalone", "--protocol", "16"]

  soroban-rpc:
    image: stellar/quickstart:testing
    ports:
      - "8001:8001"    # Soroban RPC
    command: ["--standalone", "--protocol", "16", "--soroban-rpc"]
```

### Custom Ports

To change ports, edit `docker-compose.yml` and update the port mappings:

```yaml
ports:
  - "9000:8000"  # Map host port 9000 to container port 8000
```

Then set the core API to use the new Horizon URL.

## CLI Configuration

### Global Flags

```bash
--core-url string    Core API URL (default "http://localhost:8080")
--format string      Output format: table, json (default "table")
--verbose            Enable verbose output
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Argument error |
| 2 | Core unreachable |
| 3 | Core application error |

## Dashboard Configuration

### Vite Proxy

The dashboard proxies API requests to core in development. Edit `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
},
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080` | Core API URL |

## Network Configuration

StellarYard runs on `localhost` only by default. The API is not exposed to the network.

!!! warning
    Do not expose the API to untrusted networks. There is no authentication in V1.
