# stellaryard-dashboard

The web UI for **StellarYard** — a browser-based dashboard, served locally, that gives Stellar/Soroban developers a visual interface for the local dev environment managed by [stellaryard-core](../stellaryard-core).

This repo holds no business logic. Every capability comes from core's API. If a feature needs new backend capability, that capability belongs in core's API first — this repo consumes, it does not decide.

## What StellarYard Does

StellarYard is a local development environment manager for the Stellar network. The dashboard lets you manage containers, accounts, contracts, and ledger data through a visual interface without memorizing CLI flags or reading raw JSON from curl.

## V1 Features

| Feature | Description |
|---------|-------------|
| **Container Control Panel** | View Horizon/Soroban RPC container status, start/stop/restart buttons, live log tail via WebSocket |
| **Account Manager** | List managed test accounts, create/fund new ones, view balances |
| **Ledger Viewer** | Recent transactions list, ledger sequence/state display, drill into individual transaction detail |
| **Contract Deployment UI** | Upload/select a WASM file, deploy, see resulting contract ID; invoke form for testing deployed contracts |
| **Connection Status** | Explicit "disconnected from core" indicator — never silently shows stale data |

## Tech Stack

- **Framework**: React (function components + hooks only, no class components)
- **Language**: TypeScript (strict mode)
- **Styling**: CSS modules (no CSS-in-JS)
- **Data Fetching**: React Query (`@tanstack/react-query`) for server-state caching and WS reconciliation + native `fetch`
- **Build Tool**: Vite

## Why This Stack

React + TypeScript was chosen over heavier frameworks (Next.js, etc.) because this dashboard doesn't need server-side rendering or routing complexity — it's a single-page local tool. Adding Next.js would add build complexity with no corresponding benefit for a localhost-only app. Vite keeps dev-loop iteration fast for Wave contributors working under a 7-day cycle.

## System Architecture

```
┌────────────────────────────────────┐
│ stellaryard-dashboard                │
│                                      │
│  ┌────────────┐  ┌────────────────┐│
│  │ Pages       │  │ Components      ││
│  │ - Containers│  │ - StatusBadge   ││
│  │ - Accounts  │  │ - LogViewer     ││
│  │ - Ledger    │  │ - TxTable       ││
│  │ - Contracts │  │ - DeployForm    ││
│  └─────┬──────┘  └────────┬────────┘│
│        │                  │         │
│        └────────┬─────────┘         │
│           ┌──────▼──────┐           │
│           │ API Client   │           │
│           │ (typed, from │           │
│           │ core's OpenAPI)│         │
│           └──────┬──────┘           │
└──────────────────┼──────────────────┘
                    │ REST + WS
                    ▼
          stellaryard-core (separate repo)
```

## Key Components

### Pages

| Page | Purpose |
|------|---------|
| **Containers** | View and control Horizon/Soroban RPC containers, live log streaming |
| **Accounts** | List, create, and inspect test accounts and balances |
| **Ledger** | Browse recent transactions, view ledger state, drill into transaction details |
| **Contracts** | Deploy WASM files, invoke contract methods, view results and logs |

### Shared Components

- `StatusBadge` — Visual container/account status indicator
- `LogViewer` — Real-time log display with WebSocket streaming
- `TxTable` — Transaction list with pagination
- `DeployForm` — WASM upload and contract deployment

## Data Model

Dashboard does not define its own domain models — types are generated from `stellaryard-core`'s `openapi.yaml`. This prevents drift between what core exposes and what the dashboard expects.

```ts
// Illustrative shape — actual source is generated, not hand-maintained here.
type Account = {
  id: string;
  publicKey: string;
  label: string;
  network: "local" | "testnet";
  balance?: string;
};

type ContainerStatus = {
  name: "horizon" | "soroban-rpc";
  state: "running" | "stopped" | "error";
  health: string;
};
```

## Connection & State Handling

- All server state (accounts, containers, ledger data) is fetched via React Query against core's REST API
- WebSocket log streams update a local ring-buffer per container, not global state
- Dashboard renders an explicit **"disconnected from core"** state — not a blank/loading screen — when core is unreachable

## Roadmap

Full roadmap: [`ROADMAP.md`](./ROADMAP.md) — **must be updated with every contribution** (see agent rules below).

**Blocking dependency**: `stellaryard-core`'s `/api/openapi.yaml` must be merged before any item below starts.

| Phase | Status | Scope |
|-------|--------|-------|
| **0 — Foundation** | Not started | Vite + React + TS scaffold, generate typed API client from core's OpenAPI, React Query setup, base layout, "disconnected from core" component |
| **1 — Containers** | Not started | Container status list + controls, live log viewer (WS) |
| **2 — Accounts** | Not started | Account list + balances, create/fund form |
| **3 — Ledger** | Not started | Transaction table, ledger snapshot, transaction detail (blocked on core Phase 3 XDR decision) |
| **4 — Contracts** | Not started | WASM upload/deploy, invoke form, deployment history |
| **5 — Hardening** | Not started | Error state audit, accessibility pass, responsive/mobile layout (scope TBD) |

### Open Questions
- Transaction detail decoding depth — inherited from `stellaryard-core` Phase 3
- Mobile/responsive scope — undecided, flag to maintainer

### Explicitly Deferred (not v1)
- Mainnet UI elements — blocked on core shipping mainnet support
- Dashboard auth/login — matches core's no-auth v1 assumption

## Known Failure Modes

1. **Stale data after core restart**: If core is restarted (e.g., `docker-compose down && up`), React Query's cache may serve stale account balances, container statuses, or ledger data. The "disconnected from core" indicator helps, but there's a window between core restart and reconnection where stale data is shown. React Query's `staleTime` must be tuned aggressively.
2. **WebSocket reconnection**: If the WS connection to core drops (core restart, network blip), the log viewer stops receiving logs. React Query handles REST re-fetching, but WS reconnection logic must be manual. No reconnection strategy is specified — the user may not notice logs stopped updating.
3. **CORS misconfiguration**: The dashboard is served locally but makes requests to core's localhost port. If core doesn't set `Access-Control-Allow-Origin` correctly, all API calls fail silently in the browser. This is the most common "it works in curl but not the browser" bug.
4. **Container status polling vs reality**: Container status fetched via REST may show `running` while the container is actually unhealthy or mid-restart. The status badge will show green when it should show yellow/red.
5. **WASM file upload edge cases**: Large WASM files (>5MB) may hit browser upload limits or core's request body size limit. No size validation on the client side.
6. **React Query cache invalidation**: After deploying a contract or creating an account, the relevant query must be invalidated to show fresh data. If invalidation is missed, the UI shows stale data until the next refetch interval.
7. **Multiple browser tabs**: Two dashboard tabs open simultaneously will each maintain their own React Query cache and WS connections. Actions in one tab won't reflect in the other until the next refetch.

## Edge Cases Not Yet Addressed

- Zero-state UI: What does the dashboard show when there are no accounts, no contracts, no transactions? Empty tables? Illustrative placeholders? This needs a design decision.
- WASM file type validation: The deploy form accepts any file. A non-WASM file gets sent to core and fails with a cryptic error. Client-side validation (magic bytes check) is missing.
- Contract invoke form validation: Method name and args are free-text. No schema validation against the contract's ABI. Invalid args produce cryptic Soroban errors.
- Error boundaries: If a single component throws during render (e.g., malformed data from core), the entire page crashes. No React error boundary is specified.
- Log viewer performance: High-throughput container logs rendered in React can cause UI jank. Virtualized list rendering is not specified.
- Tab persistence: If the user refreshes the page, which tab is active? No URL-based routing means the user always starts on the Containers tab.
- Transaction detail XDR display: If core returns raw XDR (undecided), the dashboard needs a decoder. If core returns decoded data, the dashboard just renders it. This dependency is unresolved.

## What's Overengineered for V1

- **React Query for a localhost app**: React Query adds caching, stale-while-revalidate, and background refetching. For a localhost app where data is always fresh (or should be), a simple `useEffect` + `fetch` + `setInterval` poll might suffice. React Query is justified for the WS reconciliation case, but the full caching layer is heavier than needed.
- **Generated typed API client from OpenAPI**: Adds a build step and code generation tooling. For V1 with a small, stable API, hand-written typed fetch calls would be simpler. The generation is correct for preventing drift, but the tooling cost is high for V1.
- **CSS modules**: For a single-page app with 4 pages and ~10 shared components, plain CSS with BEM naming might be simpler. CSS modules add build complexity.
- **Ring-buffer for log viewer**: Specified in ARCHITECTURE.md but not needed if log display is limited to the last N lines rendered in a virtualized list. The ring-buffer adds state management complexity.
- **`disconnected from core` as a shared component**: A full React component with its own state management is overkill for what's essentially a banner. A simple conditional render in each page's fetch logic would be simpler.

## V1 Non-Goals

- ❌ Raw secret key handling in the browser — all signing is a request to core
- ❌ Mainnet UI elements until core exposes mainnet endpoints
- ❌ Client-side routing beyond simple page tabs (Containers / Accounts / Ledger / Contracts)
- ❌ User accounts / dashboard login (matches core's localhost-only v1 assumption)

## Contributing

- New UI components (e.g., a transaction detail modal) should be buildable as an isolated Wave issue without needing to understand Docker orchestration or signer internals in core.
- **Every dashboard feature must map to an existing core API endpoint** — no dashboard PR should require inventing new backend behavior inline.
- **If a feature needs a new backend endpoint** — that's a core repo issue first, not something to fake client-side.
- Always test the "disconnected from core" path — it's an easy thing to miss when testing only the happy path.
- **Every PR must update `ROADMAP.md`** — mark completed items, add new work, or note invalidated assumptions. An unupdated roadmap is an incomplete PR.

### Agent Instructions

This repo includes instructions for AI coding agents:
- [`AGENTS.md`](./AGENTS.md) — Non-negotiable rules (no business logic in this repo, no raw keys in browser, types generated from core's OpenAPI, always handle disconnected state, no mainnet UI, roadmap updates required)
- [`CLAUDE.md`](./CLAUDE.md) — Claude-specific notes (verify core endpoints exist before building, update ROADMAP, stop if task implies key handling or mainnet UI)

## License

See [LICENSE](./LICENSE).
