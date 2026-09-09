# StellarYard

**A local development environment for the Stellar network.**

StellarYard eliminates the need to juggle raw CLI commands, manual Docker invocations, and curl calls to Horizon. It provides a single controllable backend for local Stellar/Soroban development with a CLI for automation and a web dashboard for visual management.

---

## What's Included

| Component | Description | Repository |
|-----------|-------------|------------|
| **stellaryard-core** | Orchestration engine and API server | [GitHub](https://github.com/StellarYard/stellaryard-core) |
| **stellaryard-cli** | Scriptable terminal client | [GitHub](https://github.com/StellarYard/stellaryard-cli) |
| **stellaryard-dashboard** | Web UI for visual management | [GitHub](https://github.com/StellarYard/stellaryard-dashboard) |

## Features

- **Container Lifecycle** — Start, stop, and monitor Horizon and Soroban RPC containers
- **Account Management** — Create and fund test accounts with Friendbot
- **Contract Deployment** — Deploy and invoke Soroban WASM contracts
- **Ledger Inspection** — Browse transactions and ledger state
- **Log Streaming** — Real-time container logs via WebSocket
- **CLI Automation** — Predictable exit codes and `--format json` for CI pipelines

## Quick Start

```bash
# Start core
git clone https://github.com/StellarYard/stellaryard-core.git
cd stellaryard-core
docker-compose up -d
go run cmd/server/main.go

# Use the CLI
git clone https://github.com/StellarYard/stellaryard-cli.git
cd stellaryard-cli
go build -o stellaryard ./cmd/stellaryard
./stellaryard containers status

# Or use the dashboard
git clone https://github.com/StellarYard/stellaryard-dashboard.git
cd stellaryard-dashboard
npm install && npm run dev
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Core | Go, chi, Docker SDK, SQLite |
| CLI | Go, cobra |
| Dashboard | React, TypeScript, Vite, React Query |
| Containers | Horizon, Soroban RPC (Docker) |

## License

[Apache 2.0](https://github.com/StellarYard/stellaryard-core/blob/main/LICENSE)
