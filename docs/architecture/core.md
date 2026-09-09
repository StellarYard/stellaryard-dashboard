# stellaryard-core

The orchestration engine and API server for StellarYard.

## Overview

Core runs as a background service on a developer's machine. It manages Docker containers for local Horizon and Soroban RPC instances and exposes a REST/WebSocket API.

## Responsibilities

- **Docker orchestration** — Start, stop, and monitor containers
- **REST API** — HTTP endpoints for all operations
- **WebSocket** — Real-time log streaming
- **SQLite** — Persistent storage for accounts and deployments
- **Signer** — Transaction signing via pluggable interface

## Key Components

| Component | Purpose |
|-----------|---------|
| `internal/api` | Chi router, handlers, middleware |
| `internal/docker` | Docker SDK client wrapper |
| `internal/signer` | Signer interface + LocalTestSigner |
| `internal/storage` | SQLite database layer |
| `internal/models` | Data models |
| `api/openapi.yaml` | OpenAPI 3.0 specification |

## Getting Started

```bash
docker compose up -d
go run cmd/server/main.go
```

API available at `http://localhost:8080/api/v1`.

## See Also

- [API Reference](../api/overview.md)
- [Local Development Guide](../guides/local-development.md)
