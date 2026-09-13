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

Open `http://localhost:3000` in your browser.

> **Note:** if core isn't running, the dashboard shows an explicit "Disconnected from core" banner — pages render error/empty states rather than stale data.

## Containers Page

The Containers page is the primary monitoring view for your local Stellar infrastructure.

### Status cards

- Each managed container (**horizon**, **soroban-rpc**) renders as a card with a color-coded status badge (green = running/healthy, yellow = running/degraded, red = stopped/error) and the container start time.
- **Auto-refresh:** status polls adapt to activity — every **1s** while a container is transitioning (`starting`), every **5s** once everything is stable.

### Action buttons

- **Start / Stop / Restart** on every card (Restart = stop, then start).
- Buttons disable themselves based on state (Start is disabled while running, Stop while stopped, Restart on error) and lock while an action is in flight — the clicked button shows a spinner, and a short success flash confirms completion.
- After each action the status query is invalidated so cards reflect the new state immediately.

### Log viewer

- Real-time log streaming from core over WebSocket, with a **Horizon / Soroban RPC** selector (switching closes the old stream and clears the buffer).
- Rendering is **virtualized** (react-window) with a **1000-line buffer** (oldest lines evicted) so high-throughput logs stay smooth; the view auto-scrolls as new lines arrive.
- **Clear** empties the display without disconnecting; **Copy** puts all displayed lines on your clipboard (with a brief "Copied!" confirmation).

### Connection loss & recovery

- If the log WebSocket drops, the viewer reconnects automatically with exponential backoff (1s → 2s → 4s → 8s), showing `reconnecting… (attempt n/5)`.
- After **5 failed attempts** it shows **Connection lost** with a **Retry** button; a successful reconnect resumes streaming.
- The REST status list recovers on its own: when core comes back, the next poll repopulates the cards. While core is unreachable, the header shows **Disconnected from core** and pages render explicit error states — never a silent blank screen.

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
| Styling | Plain CSS (single `src/index.css`) |
| Data Fetching | React Query + native fetch |
| Build Tool | Vite |

## Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 0 — Foundation | Vite scaffold, API client, base layout | ✅ Done |
| 1 — Containers | Status list, controls, log viewer | ✅ Done |
| 2 — Accounts | Account list, create/fund | ✅ Done |
| 3 — Ledger | Transaction table, ledger snapshot | ✅ Done (detail view pending core) |
| 4 — Contracts | WASM deploy, invoke form | ✅ Done |
| 5 — Hardening | Error handling, accessibility, responsive | 🚧 In progress |

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
