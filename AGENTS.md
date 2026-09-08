# AGENTS.md — stellaryard-dashboard

Instructions for AI coding agents working in this repository. Read this before making changes.

## What this repo is

Web UI for StellarYard. Consumes `stellaryard-core`'s REST/WS API. Holds no independent business logic and no keys. See `PRD.md` and `ARCHITECTURE.md` for full context; `ARCHITECTURE_ESSENTIALS.md` for a fast-reference outline.

## Non-negotiable rules

1. **This repo does not implement backend behavior.** If a task seems to require logic that belongs in `stellaryard-core` (new data source, new computation, anything beyond formatting/displaying what core returns), stop and flag that this needs a `stellaryard-core` change first — do not fake it client-side (e.g., don't compute something in the browser that should be an API response field).
2. **No raw secret key handling in the browser, ever.** Not for display, not for signing, not for convenience. All of that goes through core's API.
3. **Types/models are generated from `stellaryard-core`'s `openapi.yaml`, not hand-written.** If core's API changes, regenerate — don't manually patch a drifted local copy of a type.
4. **Must render an explicit "disconnected from core" state.** Any new page/component that fetches from core needs to handle the core-unreachable case visibly, not silently show blank/stale data. This is the most common thing missed on isolated single-component issues — check for it explicitly before marking a task done.
5. **No mainnet UI elements** (toggles, account types, etc.) until `stellaryard-core`'s `PRD.md` confirms mainnet support has actually shipped there. Don't build UI ahead of backend capability.
6. **Update `ROADMAP.md` in every contribution.** Before opening a PR: mark your item done, add newly-surfaced work, or note if your change invalidates a roadmap assumption. Treat an unupdated `ROADMAP.md` as an incomplete PR.

## Before starting any task

- Read `ARCHITECTURE_ESSENTIALS.md` first.
- Check `ROADMAP.md` for whether your task is already scoped and what phase it belongs to.
- Confirm the core API endpoint you need actually exists in `stellaryard-core`'s current `openapi.yaml` before building UI around it — do not assume an endpoint exists because it's listed in core's `ARCHITECTURE.md` roadmap; check if it's actually shipped.

## What you cannot do from this repo

- Modify `stellaryard-core` or `stellaryard-cli`. If your task needs a core API change, note it in your PR description and in this repo's `ROADMAP.md` as a blocked/dependent item, don't attempt a cross-repo edit.

## Known pitfalls

- **Stale data after core restart.** If your component uses React Query, ensure `staleTime` is low enough to catch core restarts, or invalidate the query explicitly on the "disconnected" → "connected" transition. Showing stale account balances is worse than showing a loading spinner.
- **CORS will bite you in Phase 0.** If API calls work in curl but fail in the browser, it's almost certainly a CORS issue on core's side. Don't spend time debugging your fetch code — verify core's CORS headers first.
- **WS reconnection is not automatic.** If your component uses WebSocket for log streaming, implement explicit reconnection with exponential backoff. The user will not notice that logs stopped updating.
- **Container status may be stale.** REST-fetched container status may not reflect actual Docker state (e.g., container mid-restart). Don't assume `state: "running"` means the container is healthy.
- **Add React error boundaries.** Every page should have a top-level error boundary. A malformed response from core that throws during render will crash the entire app without one.
- **Virtualize log output.** High-throughput logs rendered in a plain list will cause UI jank. Use `react-window` or equivalent for log display.
