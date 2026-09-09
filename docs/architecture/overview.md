# Architecture Overview

StellarYard is a three-component system for local Stellar development.

## System Diagram

```
┌─────────────────┐     ┌──────────────────┐
│ stellaryard-     │     │ stellaryard-cli  │
│ dashboard (web)  │     │ (terminal)       │
└────────┬─────────┘     └────────┬─────────┘
         │      REST + WS         │
         │      (localhost only)  │
         └──────────┬─────────────┘
                     │
           ┌─────────▼──────────┐
           │  stellaryard-core   │
           │                     │
           │  ┌───────────────┐  │
           │  │ API layer     │  │
           │  │ (chi router)  │  │
           │  ├───────────────┤  │
           │  │ Signer        │  │
           │  │ Interface     │  │
           │  ├───────────────┤  │
           │  │ Docker        │  │
           │  │ orchestrator  │──► Horizon container
           │  ├───────────────┤  │──► Soroban RPC container
           │  │ SQLite        │  │
           │  └───────────────┘  │
           └─────────────────────┘
```

## Component Responsibilities

### stellaryard-core

The backend service that manages everything:

- **Docker orchestration** — Start, stop, and monitor containers
- **REST API** — HTTP endpoints for all operations
- **WebSocket** — Real-time log streaming
- **SQLite** — Persistent storage for accounts and deployments
- **Signer** — Transaction signing via pluggable interface

### stellaryard-cli

The terminal client for automation:

- **Cobra commands** — Structured CLI with subcommands
- **Formatter** — Table and JSON output
- **API client** — Generated from core's OpenAPI spec
- **Exit codes** — Predictable codes for CI pipelines

### stellaryard-dashboard

The web UI for visual management:

- **React pages** — Containers, Accounts, Ledger, Contracts
- **Components** — StatusBadge, LogViewer, TxTable, DeployForm
- **API client** — Generated from core's OpenAPI spec
- **React Query** — Server state caching and synchronization

## Data Flow

1. **User** interacts with CLI or Dashboard
2. **CLI/Dashboard** sends request to Core's REST API
3. **Core** processes the request (Docker ops, DB queries, etc.)
4. **Core** returns response to CLI/Dashboard
5. **CLI/Dashboard** formats and displays the result

For log streaming:

1. **Dashboard/CLI** opens WebSocket to Core
2. **Core** subscribes to Docker container logs
3. **Core** streams logs to Dashboard/CLI in real-time
4. **Dashboard/CLI** renders logs as they arrive

## API Contract

All three repos share a single API contract: `stellaryard-core/api/openapi.yaml`

- Core implements the spec
- CLI generates its API client from the spec
- Dashboard generates its TypeScript types from the spec

This prevents drift — both clients are always in sync with the server.

## Design Principles

1. **No business logic in clients** — Core is the single source of truth
2. **Signer interface boundary** — Secret keys never cross the interface except via `Sign()`
3. **Explicit disconnected state** — Dashboard must show "disconnected from core" rather than stale data
4. **Exit codes are load-bearing** — CLI exit codes must be correct for CI pipelines
5. **OpenAPI spec is authoritative** — Never hand-write clients or fake backend behavior
