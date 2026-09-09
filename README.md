<p align="center">
  <img src="https://img.shields.io/badge/stellar-yard%20dashboard-blue?style=for-the-badge&logo=stellar&logoColor=white" alt="StellarYard Dashboard"/>
</p>

<h1 align="center">stellaryard-dashboard</h1>

<p align="center">
  The web UI for StellarYard — a browser-based dashboard for managing your local Stellar development environment.
</p>

<p align="center">
  <a href="https://github.com/StellarYard/stellaryard-dashboard/blob/main/LICENSE"><img src="https://img.shields.io/github/license/StellarYard/stellaryard-dashboard?style=flat-square" alt="License"/></a>
  <a href="https://github.com/StellarYard/stellaryard-dashboard/actions"><img src="https://img.shields.io/github/actions/workflow/status/StellarYard/stellaryard-dashboard/ci.yml?style=flat-square&label=CI" alt="CI"/></a>
  <a href="https://github.com/StellarYard/stellaryard-dashboard/issues"><img src="https://img.shields.io/github/issues/StellarYard/stellaryard-dashboard?style=flat-square" alt="Issues"/></a>
</p>

---

## What is StellarYard Dashboard?

StellarYard Dashboard is a React-based web UI that gives you visual control over your local Stellar development environment. It communicates with [stellaryard-core](../stellaryard-core)'s API — no business logic lives here.

## Quick Start

```bash
# Clone and install
git clone https://github.com/StellarYard/stellaryard-dashboard.git
cd stellaryard-dashboard
npm install

# Start core first (separate terminal)
cd ../stellaryard-core && docker-compose up -d && go run cmd/server/main.go

# Run the dashboard
npm run dev
```

Open `http://localhost:5173` in your browser.

## Features

| Feature | Description |
|---------|-------------|
| **Container Control** | View Horizon/Soroban RPC status, start/stop/restart, live logs |
| **Account Manager** | List accounts, create/fund test accounts, view balances |
| **Ledger Viewer** | Browse transactions, view ledger state, drill into details |
| **Contract Deploy** | Upload WASM, deploy, invoke contract methods |
| **Connection Status** | Explicit "disconnected from core" indicator |

## Pages

| Page | Purpose |
|------|---------|
| **Containers** | Container status, controls, live log streaming |
| **Accounts** | Account list, balances, create/fund |
| **Ledger** | Transactions, ledger snapshot, transaction detail |
| **Contracts** | WASM upload, deploy, invoke, results |

## Architecture

```
┌────────────────────────────────────┐
│ stellaryard-dashboard                │
│  ┌────────────┐  ┌────────────────┐│
│  │ Pages       │  │ Components      ││
│  │ - Containers│  │ - StatusBadge   ││
│  │ - Accounts  │  │ - LogViewer     ││
│  │ - Ledger    │  │ - TxTable       ││
│  │ - Contracts │  │ - DeployForm    ││
│  └─────┬──────┘  └────────┬────────┘│
│        └────────┬─────────┘         │
│           ┌──────▼──────┐           │
│           │ API Client   │           │
│           │ (from OpenAPI)│          │
│           └──────┬──────┘           │
└──────────────────┼──────────────────┘
                    │ REST + WS
                    ▼
          stellaryard-core
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | React (function components + hooks) |
| Language | TypeScript (strict) |
| Styling | CSS Modules |
| Data Fetching | React Query + native fetch |
| Build Tool | Vite |

## Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 0 — Foundation | Vite scaffold, API client, base layout | Not started |
| 1 — Containers | Status list, controls, log viewer | Not started |
| 2 — Accounts | Account list, create/fund | Not started |
| 3 — Ledger | Transaction table, ledger snapshot | Not started |
| 4 — Contracts | WASM deploy, invoke form | Not started |
| 5 — Hardening | Error handling, accessibility, responsive | Not started |

Full roadmap: [`ROADMAP.md`](./ROADMAP.md)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

- Check [open issues](https://github.com/StellarYard/stellaryard-dashboard/issues) for `ready` tasks
- Issues labeled `good-first-issue` are ideal for first-time contributors
- Every PR must update `ROADMAP.md`

## Maintainers

| Name | GitHub | Contact |
|------|--------|---------|
| Adejumo-2 | [@Adejumo-2](https://github.com/Adejumo-2) | [Telegram](https://t.me/Adejumo-2) |

## Community

- [GitHub Discussions](https://github.com/StellarYard/stellaryard-dashboard/discussions)

## License

[Apache 2.0](./LICENSE)

---

<p align="center">
  Built for the Stellar ecosystem
</p>
