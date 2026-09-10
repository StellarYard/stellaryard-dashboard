# ROADMAP: stellaryard-dashboard

> **This file must be updated with every contribution.** Before opening a PR: mark completed items done, add newly-surfaced work, or note if your change invalidates an assumption below. See `AGENTS.md` rule 6.

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done

## Blocking dependency

- [x] **`stellaryard-core`'s `/api/openapi.yaml` has been merged.** The API client is still hand-written but matches the spec; core now serves real data for every endpoint the pages consume (including `wasmBase64` deploy and `GET /contracts/deployments`).

## Phase 0 — Foundation

- [x] Scaffold Vite + React + TypeScript project, CI (lint + typecheck + test on PR). NOTE: the `lint` script currently has **no ESLint config or dependency in the repo** — CI lint fails as of this update and needs a config (pre-existing issue).
- [ ] Generate typed API client from `stellaryard-core`'s `openapi.yaml`; set up regeneration step — still hand-written `src/api/client.ts` (unit-tested)
- [x] React Query setup, base layout, page routing (Containers / Accounts / Ledger / Contracts tabs)
- [x] Shared "disconnected from core" component (banner + polling `useConnectionStatus` hook)

## Phase 1 — Containers page

- [x] Container status list + start/stop/restart controls — all three buttons wired via mutations with query invalidation (restart = stop + start)
- [x] Live log viewer (WS consumption) — `LogViewer` connects to core's WS endpoint, reconnects with exponential backoff, and caps the buffer at 500 lines

## Phase 2 — Accounts page

- [x] Account list + balances — balance column populated from Horizon
- [x] Create/fund account form — label + network (local/testnet), wired to `POST /accounts` with invalidation

## Phase 3 — Ledger page

- [x] Recent transactions table
- [x] Ledger snapshot display
- [ ] Transaction detail view (depends on core Phase 3 XDR-decoding decision — do not start until that's resolved in `stellaryard-core/ROADMAP.md`)

## Phase 4 — Contracts page

- [x] WASM upload/deploy form — `DeployForm` reads the file, validates WASM magic bytes client-side, and deploys via `wasmBase64`
- [x] Contract invoke form (method + args + optional source account) with result display
- [x] Deployment history list — from `GET /contracts/deployments`, invalidated on successful deploy

## Phase 5 — Hardening (required for "100% ready")

- [~] Error state handling audit — per-page error renders + mutation errors now exist; a full sweep of every page/state is still pending
- [ ] Accessibility pass (keyboard nav, screen reader labels) — not addressed, needs explicit scoping
- [ ] Responsive/mobile layout — still undecided whether in scope; **flag to maintainer rather than assuming either way**

## Explicitly deferred

- [ ] Mainnet UI elements — blocked on `stellaryard-core` shipping mainnet support
- [ ] Dashboard auth/login — matches core's no-auth v1 assumption

## What would break

- **Stale cache after core restart**: React Query `staleTime` not tuned; reconnect relies on `refetchInterval` + manual invalidation after mutations.
- **CORS misconfiguration**: still not explicitly verified; the dev proxy handles it locally.
- **WS reconnection**: now handled (exponential backoff, bounded buffer); no user-facing "reconnecting" state styling beyond a status line.
- **Container status latency**: REST-fetched status may not reflect actual Docker state — unchanged.
- **React error boundaries**: still missing; malformed core responses can crash a page.
- **Log viewer performance**: capped at 500 lines; virtualization still not used.
- **React Query cache invalidation**: deploy/create/container mutations now invalidate their queries.

## Edge cases not yet addressed

- Zero-state UI — empty tables vs placeholders: pages render empty-state messages; not a designed system
- Contract invoke args — free-text comma-separated with no ABI schema validation
- Tab persistence on refresh — no URL routing, always starts on Containers
- Multiple browser tabs — separate caches, no cross-tab sync
- Large WASM uploads — no client-side size validation (magic bytes only)
- Transaction detail XDR display — dependency on core Phase 3 unresolved

## What's overengineered for V1

- React Query full caching layer (justified for WS, overkill for localhost REST)
- Generated typed API client build step (hand-written typed fetch still in place for V1)
- CSS modules (plain CSS with BEM simpler for 4 pages)
- `disconnected from core` as shared component (simple conditional render suffices)
- Ring-buffer for log viewer (capped array handles this naturally)

## Open questions blocking full readiness

- Transaction detail decoding depth — inherited unknown from `stellaryard-core/ROADMAP.md` Phase 3
- Mobile/responsive scope — undecided, see Phase 5
- Log viewer virtualization strategy — capped buffer chosen; virtualization undecided
- Error boundary strategy — per-page or app-level, not decided
- Zero-state UI design — empty tables or illustrative placeholders, needs design decision
- ESLint configuration — missing entirely, CI lint job cannot pass until added