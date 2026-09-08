# CLAUDE.md — stellaryard-dashboard

This project's agent instructions live in [`AGENTS.md`](./AGENTS.md). Read it in full before making changes — it is the source of truth and this file does not duplicate it.

Claude-specific notes:

- Before implementing a UI feature, verify the backing core API endpoint actually exists (check `stellaryard-core`'s current `openapi.yaml`, not just its roadmap) — don't build against an endpoint that's only planned.
- Update `ROADMAP.md` as part of the same change, not as an afterthought — see `AGENTS.md` rule 6.
- If a task implies handling a raw secret key in this repo, or building mainnet-only UI, stop and surface that conflict rather than proceeding.
- **CORS is the most common Phase 0 blocker.** If API calls work in curl but fail in the browser, it's core's CORS config, not your fetch code. Verify core's headers before debugging your component.
- **WS connections don't reconnect automatically.** If your component opens a WebSocket for log streaming, implement reconnection with backoff. The user won't notice logs stopped updating.
- **Stale React Query cache after core restart.** Use low `staleTime` or explicit query invalidation on the disconnected→connected transition. Showing stale balances is worse than showing a loading state.
- **Add error boundaries to every page.** A malformed core response that throws during render crashes the entire app. Each page needs a top-level error boundary.
- **Virtualize log output.** High-throughput container logs in a plain list cause UI jank. Use `react-window` or equivalent.
