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
- [x] Tab persisted in URL (pushState + popstate, restored on refresh, defaults to `/containers` for unknown paths)

## Phase 1 — Containers page

- [x] Container status list + start/stop/restart controls — all three buttons wired via mutations with query invalidation (restart = stop + start)
- [x] Live log viewer (WS consumption) — `LogViewer` connects to core's WS endpoint, reconnects with exponential backoff (1s–8s) that **stops after 5 failed attempts** and offers a Retry button, virtualizes rendering with react-window (1000-line buffer, oldest evicted), and has a Horizon / Soroban RPC selector (switch remounts the stream: WS closes, logs clear)
- [x] `ContainerCard` component extracted (name, `StatusBadge`, formatted start time, state-disabled action buttons) — used by `ContainersPage`
- [x] Per-page React error boundaries (`ErrorBoundary` class component wraps each page; render crashes show fallback with Try Again instead of killing the app)
- [x] Phase 1 polish — dynamic auto-refresh (1s while transitioning / 5s stable), spinner + skeleton loading states, Clear/Copy log toolbar with "Copied!" confirmation, per-button loading spinners + success flash with all-button lock, responsive Containers layout (cards stack < 768px, tabs wrap, usable at 320px), a11y basics on this page (aria-labels, sr-only badge text, visible focus styles), README Containers-page docs

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
- [~] Accessibility pass (keyboard nav, screen reader labels) — all four pages have the basics (labeled forms; tables with captions, `scope="col"`, and scroll wrappers; aria-labels; sr-only status text; `role=alert`/`role=status` results; visible `:focus-visible` styles); remaining: full WCAG audit and color-contrast testing
- [ ] Runtime component tests (React Testing Library) — current tests are structural (`node:test` file assertions); runtime rendering/interaction tests still needed
- [~] Responsive/mobile layout — all four pages usable on small screens (stacked container cards, horizontally scrollable tables with truncated hashes/keys, wrapping nav/forms < 768px, usable at 320px); full mobile-first redesign still out of scope — **flag to maintainer rather than assuming either way**

## Explicitly deferred

- [ ] Mainnet UI elements — blocked on `stellaryard-core` shipping mainnet support
- [ ] Dashboard auth/login — matches core's no-auth v1 assumption

## Documentation site

- [x] MkDocs `site_url` corrected to `https://stellaryard.github.io/stellaryard-dashboard/` — was pointing at `/stellaryard-docs/`, polluting canonical/sitemap/og:url metadata. (The deployed Pages site itself was always live; a local `ERR_CONNECTION_REFUSED` was client-side.)

## What would break

- **Stale cache after core restart**: React Query `staleTime` not tuned; reconnect relies on `refetchInterval` + manual invalidation after mutations.
- **CORS misconfiguration**: still not explicitly verified; the dev proxy handles it locally.
- **WS reconnection**: now handled (exponential backoff, bounded buffer); no user-facing "reconnecting" state styling beyond a status line.
- **Container status latency**: REST-fetched status may not reflect actual Docker state — unchanged.
- **React error boundaries**: now addressed — per-page `ErrorBoundary` in `App.tsx`; a malformed core response shows a fallback with reset instead of crashing the app.
- **Log viewer performance**: addressed — react-window `List` renders only visible rows; buffer capped at 1000 lines with oldest eviction.
- **React Query cache invalidation**: deploy/create/container mutations now invalidate their queries.

## Edge cases not yet addressed

- Zero-state UI — empty tables vs placeholders: pages render empty-state messages; not a designed system
- Contract invoke args — free-text comma-separated with no ABI schema validation
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
- Log viewer virtualization strategy — resolved: react-window virtualized list (1000-line cap). Remaining: run manual perf pass against high-throughput logs.
- Error boundary strategy — resolved: per-page boundaries (`ErrorBoundary` wrapped around the page area, keyed by active tab)
- Zero-state UI design — empty tables or illustrative placeholders, needs design decision
- ESLint configuration — missing entirely, CI lint job cannot pass until added