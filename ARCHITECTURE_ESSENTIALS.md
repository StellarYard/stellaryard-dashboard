# Architecture Essentials: stellaryard-dashboard

> Quick-reference outline. Full detail: ARCHITECTURE.md.

## Stack
- React (function components/hooks only) + TypeScript (strict) + Vite
- CSS modules (no CSS-in-JS)
- React Query for server state/caching against core's API
- No Next.js, no heavy state management library

## Non-negotiable rule
**This repo holds no business logic and no keys.** Every capability comes from `stellaryard-core`'s API. If a feature needs backend behavior that doesn't exist yet, the fix is a core API issue, not a dashboard workaround.

## Repo role
Pure consumer of `stellaryard-core`'s REST + WS API. No independent domain models — types come from core's `openapi.yaml`, not hand-written here.

## Key components (rough map)
- Pages: Containers, Accounts, Ledger, Contracts
- Shared: `StatusBadge`, `LogViewer`, `TxTable`, `DeployForm`
- `API Client` — typed wrapper around core's endpoints, single point of contact with backend

## Must-handle case
Explicit "disconnected from core" UI state — do not let this silently show stale/blank data. Common miss on isolated single-component issues.

## Explicit v1 non-goals
- No raw secret key handling/display in browser
- No mainnet UI elements until core supports mainnet
- No dashboard auth/login (matches core's localhost-only v1 assumption)

## What would break
- Stale React Query cache after core restart → UI shows old data during the reconnection window
- CORS misconfiguration → all API calls fail silently in browser ("works in curl" bug)
- WS connection drops → log streaming stops silently, no reconnection strategy
- Container status REST-fetched while mid-restart → status badge shows green when it should show yellow
- Missing React error boundaries → malformed core response crashes entire page
- Log viewer without virtualization → UI jank on high-throughput containers

## Edge cases missing
- Zero-state UI (no accounts/contracts/transactions) — empty tables or placeholders? Needs design decision
- WASM file validation — deploy form accepts any file, no client-side magic bytes check
- Contract invoke args — free-text with no ABI schema validation, cryptic Soroban errors
- Tab persistence on page refresh — no URL routing, always starts on Containers tab
- Multiple browser tabs — separate caches, actions don't cross-tab sync
- Large WASM uploads — no client-side size validation before sending to core
- Transaction detail XDR display — dependency on core Phase 3 decision unresolved

## What's overengineered
- React Query full caching layer for a localhost app (justified for WS, overkill for REST)
- Generated typed API client build step for a small, stable V1 API
- CSS modules for 4 pages and ~10 components
- `disconnected from core` as a shared component (simple conditional render would suffice)

## When in doubt
If a Wave issue would require adding a new backend endpoint to make a dashboard feature work — stop, that's a core repo issue first, not something to fake client-side.
