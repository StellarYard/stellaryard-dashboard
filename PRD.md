# PRD: stellaryard-dashboard

## What We're Building

`stellaryard-dashboard` is the web UI for StellarYard. It is a browser-based dashboard, served locally, that gives Stellar/Soroban developers a visual interface for the local dev environment managed by `stellaryard-core`. It talks to core exclusively through core's REST/WebSocket API — it holds no independent state about containers, accounts, or ledger data beyond what it fetches from or is pushed by core.

This repo has no business logic of its own. If a feature requires new backend capability, that capability belongs in `stellaryard-core`'s API first — this repo consumes, it does not decide.

## Who It's For

- Stellar/Soroban developers who want to see and control their local network state (containers, accounts, contracts, ledger activity) without memorizing CLI flags or reading raw JSON from curl.
- Developers debugging contract behavior who want a readable transaction/log view instead of scrolling raw Docker logs.
- Wave contributors building individual UI components/pages against a fixed, already-defined core API — this repo is intentionally the easiest of the three to contribute isolated, low-coordination-cost issues against.

## What The Product Actually Needs To Do

### V1

1. **Container control panel**: view Horizon/Soroban RPC container status, start/stop/restart buttons, live log tail (via core's WS endpoint).
2. **Account manager**: list managed test accounts, create/fund new ones, view balances — all via core's `/accounts` endpoints.
3. **Ledger viewer**: recent transactions list, ledger sequence/state display, drill into individual transaction detail.
4. **Contract deployment UI**: upload/select a WASM file, deploy, see resulting contract ID; a simple invoke form (method name + args) for testing deployed contracts.
5. **Connection status indicator**: dashboard must clearly show when it's lost connection to core (core not running, container down, etc.) rather than silently showing stale data.

### Explicitly NOT in V1

- No client-side key generation or signing — all of that goes through core's `Signer` interface, dashboard never touches raw keys.
- No mainnet UI elements (no "switch to mainnet" toggle) until core actually supports it. Do not build UI ahead of backend capability.
- No user accounts / dashboard login (v1 is a local single-developer tool, matches core's no-auth localhost assumption).

## Success Criteria

- A developer can go from "containers are off" to "contract deployed and invoked" without touching a terminal.
- Every dashboard feature maps to an existing core API endpoint — no dashboard PR should require inventing new backend behavior inline.
- New UI components (e.g., a transaction detail modal) should be buildable as an isolated Wave issue without needing to understand the Docker orchestration or signer internals in core.

## What Would Break

- **Stale data after core restart**: React Query caches may serve old account balances or container statuses after core is restarted. The "disconnected from core" indicator helps, but there's a window where stale data is shown. `staleTime` must be tuned aggressively.
- **CORS misconfiguration**: If core doesn't set `Access-Control-Allow-Origin` correctly, all API calls fail silently in the browser. This is the #1 "works in curl, not in browser" bug.
- **WebSocket reconnection**: If the WS connection drops, log streaming stops silently. No reconnection strategy is specified — the user may not notice.
- **Container status vs reality**: REST-fetched status may show `running` while the container is unhealthy or mid-restart. The status badge shows green when it should show yellow.
- **React Query cache invalidation**: After deploying a contract or creating an account, the relevant query must be invalidated. Missed invalidation = stale UI.
- **React error boundaries**: If a component throws during render (malformed data from core), the entire page crashes. No error boundary is specified.

## Edge Cases Not Yet Addressed

- Zero-state UI: No accounts, no contracts, no transactions — empty tables or illustrative placeholders? Needs a design decision.
- WASM file validation: Deploy form accepts any file. No client-side magic bytes check. Non-WASM files produce cryptic core errors.
- Contract invoke validation: Free-text method name and args with no ABI schema validation.
- Log viewer performance: High-throughput logs rendered in React cause UI jank. Virtualized list rendering not specified.
- Tab persistence on refresh: No URL routing means user always starts on Containers tab.
- Multiple browser tabs: Two tabs maintain separate caches. Actions in one don't reflect in the other.
- Large WASM uploads: No client-side size validation. Files >5MB may hit browser or core limits.
- Transaction detail XDR display: If core returns raw XDR, dashboard needs a decoder. Dependency unresolved.

## What's Overengineered

- **React Query for a localhost app**: Full caching layer (stale-while-revalidate, background refetch) is heavier than needed for a local tool. Justified for WS reconciliation, but the rest is overkill.
- **Generated typed API client**: Build step + code generation tooling for a small, stable V1 API. Hand-written typed fetch calls would be simpler.
- **CSS modules**: For 4 pages and ~10 components, plain CSS with BEM naming would be simpler.
- **Ring-buffer for log viewer**: Unnecessary if log display is limited to last N lines in a virtualized list.
- **`disconnected from core` as a shared component**: Overkill for what's essentially a banner. A conditional render per page would be simpler.
