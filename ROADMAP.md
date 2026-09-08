# ROADMAP: stellaryard-dashboard

> **This file must be updated with every contribution.** Before opening a PR: mark completed items done, add newly-surfaced work, or note if your change invalidates an assumption below. See `AGENTS.md` rule 6.

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done

## Blocking dependency

- [ ] **`stellaryard-core`'s `/api/openapi.yaml` must be merged before any item below starts.** This repo generates its API client from it. If it isn't merged yet, that's the actual next task — see `stellaryard-core/ROADMAP.md` Phase 0.

## Phase 0 — Foundation

- [ ] Scaffold Vite + React + TypeScript project, CI (lint + typecheck + test on PR)
- [ ] Generate typed API client from `stellaryard-core`'s `openapi.yaml`; set up regeneration step (script or CI check) so drift is caught automatically, not just by convention
- [ ] React Query setup, base layout, page routing (Containers / Accounts / Ledger / Contracts tabs)
- [ ] Shared "disconnected from core" component — build this early since every later page depends on it (see `AGENTS.md` rule 4)

## Phase 1 — Containers page

- [ ] Container status list + start/stop/restart controls
- [ ] Live log viewer (WS consumption)

## Phase 2 — Accounts page

- [ ] Account list + balances
- [ ] Create/fund account form

## Phase 3 — Ledger page

- [ ] Recent transactions table
- [ ] Ledger snapshot display
- [ ] Transaction detail view (depends on core Phase 3 XDR-decoding decision — do not start until that's resolved in `stellaryard-core/ROADMAP.md`, or you'll build against an unstable response shape)

## Phase 4 — Contracts page

- [ ] WASM upload/deploy form
- [ ] Contract invoke form (method + args)
- [ ] Deployment history list

## Phase 5 — Hardening (required for "100% ready")

- [ ] Error state handling audit across all pages, not just the connection-loss case — what does the UI show on a core-side application error (Phase 3/exit-code-3-equivalent for CLI)?
- [ ] Accessibility pass (keyboard nav, screen reader labels) — not addressed in any phase above, needs explicit scoping
- [ ] Responsive/mobile layout — currently undecided whether this is in scope at all; **flag to maintainer rather than assuming either way**

## Explicitly deferred

- [ ] Mainnet UI elements — blocked on `stellaryard-core` shipping mainnet support, not a dashboard-side task until then
- [ ] Dashboard auth/login — matches core's no-auth v1 assumption; revisit together if that changes

## What would break

- **Stale cache after core restart**: React Query serves old data during reconnection window. Must tune `staleTime` aggressively or invalidate on reconnect.
- **CORS misconfiguration**: All API calls fail silently in browser. #1 "works in curl" bug. Must verify in Phase 0.
- **WS reconnection**: Log streaming stops silently on connection drop. No automatic reconnection specified.
- **Container status latency**: REST-fetched status may not reflect actual Docker state (mid-restart, unhealthy).
- **React error boundaries**: Missing. Malformed core response crashes entire page.
- **Log viewer performance**: High-throughput logs in plain list cause UI jank without virtualization.
- **React Query cache invalidation**: After deploy/create actions, queries must be invalidated. Missed invalidation = stale UI.

## Edge cases not yet addressed

- Zero-state UI — empty tables vs placeholders for no accounts/contracts/transactions
- WASM file validation — deploy form accepts any file, no client-side check
- Contract invoke args — free-text with no ABI schema validation
- Tab persistence on refresh — no URL routing, always starts on Containers
- Multiple browser tabs — separate caches, no cross-tab sync
- Large WASM uploads — no client-side size validation
- Transaction detail XDR display — dependency on core Phase 3 unresolved
- Log viewer without virtualization — UI jank on high-throughput containers

## What's overengineered for V1

- React Query full caching layer (justified for WS, overkill for localhost REST)
- Generated typed API client build step (hand-written typed fetch simpler for V1)
- CSS modules (plain CSS with BEM simpler for 4 pages)
- `disconnected from core` as shared component (simple conditional render suffices)
- Ring-buffer for log viewer (virtualized list handles this naturally)

## Open questions blocking full readiness

- Transaction detail decoding depth — inherited unknown from `stellaryard-core/ROADMAP.md` Phase 3
- Mobile/responsive scope — undecided, see Phase 5
- Log viewer virtualization strategy — needed, not scoped
- Error boundary strategy — per-page or app-level, not decided
- Zero-state UI design — empty tables or illustrative placeholders, needs design decision
