# Architecture: stellaryard-dashboard

## Tech Stack

- **Framework**: React (function components + hooks only, no class components — keeps the codebase approachable for Wave contributors of varying experience)
- **Language**: TypeScript (strict mode) — given this is a multi-contributor, loosely-coordinated Wave project, type safety against core's API contract catches integration bugs at compile time rather than runtime
- **Styling**: plain CSS modules (no heavy CSS-in-JS dependency — keeps individual component PRs simple to review)
- **Data fetching**: a thin typed API client generated/maintained from core's `openapi.yaml` (see below) + native `fetch`; no heavyweight state management library needed for v1 — React Query (`@tanstack/react-query`) for server-state caching and WS reconciliation is the one exception, justified because it directly solves the "core restarted, is my data stale" problem this dashboard cares about.
- **Build**: Vite

## Why This Stack

React + TypeScript was chosen over a heavier framework (Next.js, etc.) because this dashboard doesn't need server-side rendering or routing complexity — it's a single-page local tool. Adding Next.js would add build complexity with no corresponding benefit for a localhost-only app. Vite keeps dev-loop iteration fast, which matters when Wave contributors are working under a 7-day cycle.

## System Overview

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

## Data Models

Dashboard does not define its own domain models — it imports/mirrors types generated from `stellaryard-core`'s `openapi.yaml`. This is deliberate: maintaining a second, hand-written copy of `Account`, `ContainerStatus`, etc. in this repo is exactly the kind of drift that breaks multi-repo Wave projects. If core's schema changes, dashboard's types should be regenerated, not manually patched.

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

- All server state (accounts, containers, ledger data) is fetched via React Query against core's REST API; WS log streams update a local ring-buffer per container, not global state.
- Dashboard must render an explicit "disconnected from core" state, not a blank/loading screen indefinitely, if core is unreachable — this is called out because it's an easy thing for an isolated-issue contributor to miss if they only test the happy path.

## Known Failure Modes

- **Stale cache after core restart**: React Query may serve cached data after core is restarted. The cache invalidation strategy must be aggressive (low `staleTime`) or explicitly invalidated on the "disconnected" → "connected" transition.
- **WS reconnection**: No automatic reconnection strategy for dropped WebSocket connections. Log streaming stops silently. Must implement exponential backoff reconnection.
- **CORS**: If core's CORS headers are misconfigured, all API calls fail silently in the browser. This must be verified during Phase 0 integration testing.
- **Container status latency**: REST-fetched status may be stale relative to actual Docker state. A container could be mid-restart when the dashboard reads its status.
- **React error boundaries**: No error boundary is specified. A single malformed response from core can crash the entire page. Each page should have a top-level error boundary.
- **Log viewer virtualization**: High-throughput logs rendered in a plain React list will cause UI jank. Must use virtualized rendering (e.g., `react-window`) for log display.

## What's Overengineered for V1

- **React Query**: The full caching/stale-while-revalidate/background-refetch layer is heavier than needed for a localhost app where data is always fresh. Justified for the WS reconciliation case, but the rest is overkill.
- **Generated typed API client**: Build step + code generation tooling for a small, stable V1 API. Hand-written typed fetch calls would be simpler and avoid the generation tooling dependency.
- **CSS modules**: For 4 pages and ~10 shared components, plain CSS with BEM naming would be simpler.
- **`disconnected from core` as a shared component**: Overkill for what's essentially a conditional banner. A simple `if (error) return <Banner />` per page would be simpler.

## Non-Goals (v1)

- No raw key handling in the browser at all — every signing operation is a request to core, dashboard never sees a `SecretKey` value beyond maybe a masked display if core ever chooses to expose one (it currently does not).
- No mainnet-specific UI until core exposes mainnet endpoints.
- No client-side routing complexity beyond simple page tabs (Containers / Accounts / Ledger / Contracts).
