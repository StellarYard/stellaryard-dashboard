# stellaryard-dashboard — Phase 1 Issues

---

# [Phase 1] Container status list page

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Small
> **Points:** 150
> **Estimated time:** 2-4 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done
>
> **This repo does not implement backend behavior. If a feature needs a new backend endpoint, that's a core repo issue first.**

stellaryard-dashboard is the web UI for StellarYard. This issue builds the Containers page that displays the status of all managed containers.

---

## Problem

Developers need a visual interface to see container statuses without running CLI commands. The Containers page is the primary view for monitoring local Stellar infrastructure.

---

## Scope

**In scope:**
- Containers page accessible via tab in App.tsx
- Fetch container statuses from core API: GET /api/v1/containers
- Display each container as a card with name, state, and health
- Auto-refresh every 3 seconds using React Query
- Loading state while fetching
- Error state if core unreachable

**Out of scope:**
- Start/stop/restart buttons (D-1.03)
- Log viewer (D-1.04)
- Container card component (D-1.02 — separate issue)

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. Containers page renders when Containers tab is clicked
2. Fetches container statuses from core API
3. Displays each container with name and status
4. Auto-refreshes every 3 seconds
5. Shows loading spinner during initial fetch
6. Shows error message when core is unreachable
7. Page recovers automatically when core comes back

---

## Implementation Guidelines

### Key files to modify or create
- `src/pages/containers/ContainersPage.tsx` — Main page component

### Architecture constraints
- Use React Query's useQuery with refetchInterval
- Do NOT use setInterval manually
- Test the "disconnected from core" case
- Must render explicit error state, not blank/loading

### Suggested approach
1. Implement ContainersPage component
2. Use useQuery to fetch container statuses
3. Render each container as a card
4. Set refetchInterval to 3000ms
5. Handle loading and error states

### Testing approach
- Manual: open browser, verify containers display
- Manual: stop core, verify error state
- Manual: start core, verify recovery

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] Containers page renders on tab click
- [ ] Fetches statuses from core API
- [ ] Displays container cards with name and status
- [ ] Auto-refreshes every 3 seconds
- [ ] Loading state shown during fetch
- [ ] Error state shown when core unreachable
- [ ] Recovers automatically when core comes back
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented the page as described
- [ ] I have tested loading, success, and error states
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: build container status list page`

---

## References

- `ARCHITECTURE.md` → "Data Models" → ContainerStatus
- `api/openapi.yaml` → GET /containers
- `src/api/client.ts` — listContainers() method

---

# [Phase 1] Container card component

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard needs a reusable component to display a single container's status. This issue builds the ContainerCard component.

---

## Problem

Container status display should be a reusable component, not inline JSX. This allows consistent styling and reuse across pages.

---

## Scope

**In scope:**
- ContainerCard component
- Props: name, state, health, started
- Displays container name, status badge, start time
- Styled as a card with border, padding, shadow

**Out of scope:**
- Action buttons (D-1.03)
- Log viewer (D-1.04)
- Responsive layout (D-1.10)

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. ContainerCard component exists in `src/components/ContainerCard.tsx`
2. Accepts props for container data
3. Renders name as heading
4. Renders StatusBadge component
5. Renders started time in human-readable format
6. Styled with CSS class "container-card"

---

## Implementation Guidelines

### Key files to modify or create
- `src/components/ContainerCard.tsx` — New component

### Architecture constraints
- Reuse StatusBadge component from Phase 0
- Keep component simple — just display, no actions

### Suggested approach
1. Create ContainerCard component
2. Accept props: name, state, health, started
3. Render name as h3
4. Render StatusBadge
5. Format and render started time

### Testing approach
- Render with running container → green badge
- Render with stopped container → red badge
- Render with starting container → yellow badge

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] ContainerCard component exists
- [ ] Accepts correct props
- [ ] Renders name, status badge, started time
- [ ] Uses StatusBadge component
- [ ] Styled with "container-card" class
- [ ] Tests verify rendering for each state
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented the component as described
- [ ] I have written tests for each state
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: build ContainerCard component`

---

## References

- `src/components/StatusBadge.tsx` — reuse this component

---

# [Phase 1] Container start/stop/restart action buttons

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Small
> **Points:** 150
> **Estimated time:** 2-4 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard needs action buttons to start, stop, and restart containers from the UI.

---

## Problem

Without action buttons, developers must use the CLI or terminal to start/stop containers. The dashboard should provide a complete container management experience.

---

## Scope

**In scope:**
- Start, Stop, Restart buttons on each ContainerCard
- Start: calls POST /api/v1/containers/{name}/start
- Stop: calls POST /api/v1/containers/{name}/stop
- Restart: calls stop then start
- Disable buttons based on container state
- Invalidate query after action to refresh status

**Out of scope:**
- Confirmation dialogs (V1 is localhost-only, low risk)
- Loading state on buttons (D-1.09 — separate polish issue)

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. Start, Stop, Restart buttons appear on each card
2. Start disabled when state is "running"
3. Stop disabled when state is "stopped"
4. Restart disabled when state is "error"
5. Clicking Start calls core API and refreshes status
6. Clicking Stop calls core API and refreshes status
7. Restart calls stop then start

---

## Implementation Guidelines

### Key files to modify or create
- `src/components/ContainerCard.tsx` — Add action buttons

### Architecture constraints
- Always invalidate the query after a mutation
- Show loading state on clicked button
- Restart is stop + start in sequence

### Suggested approach
1. Add action buttons to ContainerCard
2. Use React Query useMutation for each action
3. After mutation success, invalidate ["containers"] query
4. Disable buttons based on container state

### Testing approach
- Click Start on stopped container → status updates
- Click Stop on running container → status updates
- Verify buttons disabled in correct states

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] Start, Stop, Restart buttons exist
- [ ] Start disabled when running
- [ ] Stop disabled when stopped
- [ ] Restart disabled when error
- [ ] Actions call correct API endpoints
- [ ] Query invalidated after action
- [ ] Status refreshes after action
- [ ] Tests verify button states and actions
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented action buttons as described
- [ ] I have tested all button states and actions
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: add container start/stop/restart action buttons`

---

## References

- `api/openapi.yaml` → POST /containers/{name}/start, /stop
- `src/api/client.ts` — startContainer(), stopContainer() methods

---

# [Phase 1] Log viewer component with WebSocket streaming

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Medium
> **Points:** 150
> **Estimated time:** 2-4 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard needs real-time log streaming from containers. This issue builds the LogViewer component.

---

## Problem

Developers need to see container logs in real time from the dashboard. Without a log viewer, they must use the terminal.

---

## Scope

**In scope:**
- LogViewer component
- Connects to core WS endpoint
- Displays log lines in terminal-style div
- Auto-scrolls to bottom
- Shows "Connecting..." while establishing connection
- Shows "Disconnected" when connection drops

**Out of scope:**
- WebSocket reconnection (D-1.05)
- Virtualized rendering (D-1.06)
- Clear/copy functionality (D-1.12)
- Container selector (D-1.11)

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. LogViewer component exists in `src/components/LogViewer.tsx`
2. Connects to ws://localhost:8080/api/v1/containers/{name}/logs
3. Displays log lines in dark terminal-style div
4. Auto-scrolls as new lines arrive
5. Shows "Connecting..." during connection
6. Shows "Disconnected" when connection drops

---

## Implementation Guidelines

### Key files to modify or create
- `src/components/LogViewer.tsx` — Implement component

### Architecture constraints
- Use native WebSocket API (no library needed)
- Terminal-style: dark background (#1a1a1a), green text (#0f0), monospace font
- Auto-scroll using ref + scrollIntoView

### Suggested approach
1. Implement LogViewer with WS connection
2. Store log lines in state array
3. Auto-scroll using useRef + scrollIntoView
4. Handle WS onopen, onmessage, onclose, onerror

### Testing approach
- Start container → logs appear in real time
- Stop container → "Disconnected" shown
- Restart core → connection lost, then reconnects

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] LogViewer component exists
- [ ] Connects to core WS endpoint
- [ ] Displays log lines in terminal style
- [ ] Auto-scrolls to bottom
- [ ] Shows "Connecting..." during connection
- [ ] Shows "Disconnected" on connection drop
- [ ] Manual test: logs stream in real time
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented LogViewer as described
- [ ] I have tested with running container
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: build LogViewer component with WebSocket streaming`

---

## References

- `api/openapi.yaml` → WS /containers/{name}/logs
- `ARCHITECTURE.md` → "Data Models" → ContainerStatus

---

# [Phase 1] Log viewer WebSocket reconnection with backoff

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Small
> **Points:** 150
> **Estimated time:** 2-4 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard's LogViewer must reconnect when the WebSocket drops. This issue adds automatic reconnection with exponential backoff.

---

## Problem

When core restarts or network blips, the WS connection drops and logs stop streaming. Without reconnection, the user must manually refresh the page.

---

## Scope

**In scope:**
- Exponential backoff: 1s, 2s, 4s, 8s
- Reconnection status in UI: "Reconnecting... (attempt 2)"
- Stop after 5 failed attempts, show "Connection lost"
- Resume streaming after successful reconnect

**Out of scope:**
- Resume from specific log position (V1 starts fresh)
- Multiple reconnect strategies

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. WS reconnection happens automatically on drop
2. Backoff: 1s, 2s, 4s, 8s between attempts
3. UI shows reconnection status with attempt count
4. After 5 failures, shows "Connection lost"
5. Successful reconnect resumes log streaming

---

## Implementation Guidelines

### Key files to modify or create
- `src/components/LogViewer.tsx` — Add reconnection logic

### Architecture constraints
- Use exponential backoff with max 8s
- Track attempt count in useRef (avoid stale closures)
- Stop after 5 failed attempts

### Suggested approach
1. Add reconnection state to LogViewer
2. On WS close (unexpected): start reconnection loop
3. Exponential backoff with max 8s
4. Show status in UI
5. Stop after 5 attempts

### Testing approach
- Stop core → "Reconnecting..." shown
- Start core → logs resume
- Keep core off → "Connection lost" after 5 attempts

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] WS reconnection is automatic
- [ ] Backoff is exponential: 1s, 2s, 4s, 8s
- [ ] UI shows reconnection status
- [ ] Stops after 5 failed attempts
- [ ] Shows "Connection lost" after 5 failures
- [ ] Successful reconnect resumes streaming
- [ ] Tests verify reconnection behavior
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented reconnection as described
- [ ] I have tested with core restart
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: add WebSocket reconnection with backoff to LogViewer`

---

## References

- `ARCHITECTURE.md` → "Known Failure Modes" → WS reconnection
- Depends on: D-1.04 (LogViewer component)

---

# [Phase 1] Log viewer virtualized rendering for performance

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Medium
> **Points:** 150
> **Estimated time:** 2-4 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard's LogViewer can become slow with high-throughput logs. This issue adds virtualized rendering.

---

## Problem

Plain React lists cause UI jank with thousands of log lines. Virtualized rendering only renders visible rows, keeping performance smooth.

---

## Scope

**In scope:**
- Install react-window
- Replace plain list with FixedSizeList
- Cap display at 1000 lines (ring buffer)
- Auto-scroll to bottom with virtualization

**Out of scope:**
- Variable-height rows (use fixed height for V1)
- Search/filter in logs

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. react-window is installed
2. LogViewer uses FixedSizeList
3. Only visible rows are rendered
4. Auto-scroll works with virtualization
5. Old lines evicted at 1000 line cap
6. Scroll performance is smooth

---

## Implementation Guidelines

### Key files to modify or create
- `src/components/LogViewer.tsx` — Replace list with FixedSizeList
- `package.json` — Add react-window dependency

### Architecture constraints
- FixedSizeList with estimatedItemSize for log lines
- Cap logLines array at 1000 entries

### Suggested approach
1. Install react-window
2. Replace div list with FixedSizeList
3. Each row renders a single log line
4. Cap logLines at 1000 entries
5. Auto-scroll using ref + scrollTo

### Testing approach
- Verify smooth scrolling with 1000+ lines
- Verify auto-scroll still works
- Verify old lines are evicted

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] react-window is installed
- [ ] FixedSizeList is used for log rendering
- [ ] Only visible rows rendered
- [ ] Auto-scroll works with virtualization
- [ ] 1000 line cap with oldest eviction
- [ ] Scroll performance is smooth
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented virtualized rendering as described
- [ ] I have tested with high-throughput logs
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: add virtualized rendering to LogViewer for performance`

---

## References

- `ARCHITECTURE.md` → "Known Failure Modes" → Log viewer performance
- Depends on: D-1.04 (LogViewer component)

---

# [Phase 1] Container page loading state

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard must show meaningful loading states. This issue adds loading spinners and skeleton placeholders.

---

## Problem

Without loading states, users see a blank page during initial fetch, which feels broken.

---

## Scope

**In scope:**
- Loading spinner during initial fetch
- Skeleton placeholders for container cards
- Only show empty state after data is fetched

**Out of scope:**
- Loading states for individual actions (D-1.09)
- Error states (D-1.08)

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. Loading spinner shows during initial fetch
2. Skeleton cards show as placeholders
3. Empty state only shows after fetch completes with no data
4. No blank page during loading

---

## Implementation Guidelines

### Key files to modify or create
- `src/pages/containers/ContainersPage.tsx` — Add loading state
- `src/index.css` — Add loading spinner styles

### Architecture constraints
- Use React Query's isLoading flag
- Distinguish loading from empty from error

### Suggested approach
1. Check isLoading from useQuery
2. Render loading spinner during load
3. Render skeleton cards as placeholders
4. Only show "No containers" when not loading and empty

### Testing approach
- Refresh page → spinner shows briefly
- Data loads → spinner disappears
- Core stopped → error state (not loading)

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] Loading spinner shows during fetch
- [ ] Skeleton placeholders during load
- [ ] Empty state only after fetch completes
- [ ] No blank page during loading
- [ ] CSS for loading spinner exists
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented loading states as described
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: add loading states to Containers page`

---

## References

- `ARCHITECTURE.md` → "Connection & State Handling"

---

# [Phase 1] Container page error state handling

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard must handle errors gracefully. This issue adds error states to the Containers page.

---

## Problem

Without error states, users see blank/loading indefinitely when core is unreachable. This is the most common thing missed on isolated component issues (per AGENTS.md rule 4).

---

## Scope

**In scope:**
- "Cannot connect to stellaryard-core" when core unreachable
- Error message from core when API returns error
- "Log stream unavailable" in LogViewer on WS error
- Retry button or auto-retry

**Out of scope:**
- Error boundaries (D-1.14)
- Error logging

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. "Cannot connect" message when core unreachable
2. Error message from core when API errors
3. "Log stream unavailable" on WS error
4. Page recovers when core comes back
5. Never shows blank/loading indefinitely

---

## Implementation Guidelines

### Key files to modify or create
- `src/pages/containers/ContainersPage.tsx` — Add error state
- `src/components/LogViewer.tsx` — Add WS error state
- `src/index.css` — Add error styles

### Architecture constraints
- Error state must be visible (not console.log)
- Include retry mechanism

### Suggested approach
1. Check error from useQuery
2. Render error message with retry button
3. In LogViewer, handle WS error
4. Add CSS for error styling

### Testing approach
- Stop core → error message shows
- Start core → page recovers
- Stop core during log streaming → error shown

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] Error message when core unreachable
- [ ] Error message from API errors
- [ ] LogViewer shows error on WS failure
- [ ] Page recovers when core comes back
- [ ] Never shows blank indefinitely
- [ ] CSS for error styling exists
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented error states as described
- [ ] I have tested with core stopped
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: add error state handling to Containers page`

---

## References

- `ARCHITECTURE.md` → "Known Failure Modes" → Container status latency
- `AGENTS.md` → rule 4 (must render disconnected state)

---

# [Phase 1] Container action button loading and disabled states

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard's action buttons need polished loading states to prevent double-clicks and show progress.

---

## Problem

Without loading states, users can double-click buttons causing duplicate API calls.

---

## Scope

**In scope:**
- Show loading spinner on clicked button
- Disable other buttons during operation
- Prevent double-clicks
- Success flash after action completes

**Out of scope:**
- Confirmation dialogs
- Undo functionality

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. Loading spinner on mutating button
2. Other buttons disabled during operation
3. Double-clicks are ignored
4. Success flash after completion
5. Buttons update to new state after action

---

## Implementation Guidelines

### Key files to modify or create
- `src/components/ContainerCard.tsx` — Update button states
- `src/index.css` — Add success flash animation

### Architecture constraints
- Disable ALL buttons during mutation, not just the clicked one
- Use useMutation's isLoading flag

### Suggested approach
1. Use useMutation isLoading for button states
2. Show spinner on mutating button
3. Disable other buttons
4. Add success flash CSS animation

### Testing approach
- Click Start → spinner shows, Stop disabled
- Operation completes → buttons update
- Quick double-click → second ignored

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] Loading spinner on mutating button
- [ ] Other buttons disabled during operation
- [ ] Double-clicks prevented
- [ ] Success flash after completion
- [ ] Buttons update after action
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have polished button states as described
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: polish container action button loading states`

---

## References

- Depends on: D-1.03 (action buttons)

---

# [Phase 1] Container page responsive layout

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard should work on different screen sizes. This issue adds responsive layout to the Containers page.

---

## Problem

Without responsive layout, the page may be unusable on smaller screens.

---

## Scope

**In scope:**
- Container cards stack on small screens (< 768px)
- Action buttons wrap if needed
- Log viewer full-width on all screens
- Tab navigation scrollable on very small screens

**Out of scope:**
- Mobile-first design (V1 is localhost dev tool)
- Touch gestures

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. Cards stack vertically on mobile (< 768px)
2. Cards side-by-side on tablet/desktop
3. Log viewer full-width always
4. Page usable at 320px width

---

## Implementation Guidelines

### Key files to modify or create
- `src/index.css` — Add media queries

### Architecture constraints
- Use CSS flexbox with wrap
- Test at 320px, 768px, 1200px

### Suggested approach
1. Add media queries for container cards
2. Use flex-wrap for card layout
3. Make log viewer full-width

### Testing approach
- Resize to mobile → cards stack
- Resize to tablet → cards side by side
- Resize to desktop → full layout

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] Cards stack on small screens
- [ ] Cards side-by-side on larger screens
- [ ] Log viewer full-width always
- [ ] Page usable at 320px
- [ ] Media queries in CSS
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have added responsive layout as described
- [ ] I have tested at multiple screen sizes
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: make Containers page responsive`

---

## References

- `ARCHITECTURE.md` → "Non-Goals" → responsive/mobile layout (uncertain scope)

---

# [Phase 1] Log viewer container selector

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard's LogViewer needs a way to switch between Horizon and Soroban RPC logs.

---

## Problem

Without a selector, users can only see logs for one hardcoded container.

---

## Scope

**In scope:**
- Selector with "horizon" and "soroban-rpc" buttons
- Switching disconnects from current WS and connects to new one
- Default: Horizon logs
- Clear log lines on switch

**Out of scope:**
- Log persistence across switches
- Multiple simultaneous log streams

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. Two buttons above log viewer: "Horizon" and "Soroban RPC"
2. Clicking a button switches the log stream
3. Active button is visually distinct
4. Log lines clear on switch
5. New container's logs appear after switch

---

## Implementation Guidelines

### Key files to modify or create
- `src/components/LogViewer.tsx` — Add container selector

### Architecture constraints
- Close WS before opening new one
- Two simple buttons are sufficient for V1

### Suggested approach
1. Add container selector state
2. Two buttons for horizon/soroban-rpc
3. On switch: close WS, clear logs, connect to new
4. Style active button differently

### Testing approach
- Switch from horizon to soroban-rpc → logs change
- Switch back → horizon logs appear
- Both containers stream correctly

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] Container selector exists with two buttons
- [ ] Clicking switches log stream
- [ ] Active button is visually distinct
- [ ] Log lines clear on switch
- [ ] Both containers stream correctly
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented container selector as described
- [ ] I have tested switching between containers
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: add container selector to LogViewer`

---

## References

- Depends on: D-1.04 (LogViewer component)

---

# [Phase 1] Log viewer clear and copy functionality

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard's LogViewer needs convenience actions: clear displayed logs and copy to clipboard.

---

## Problem

Users need to clear cluttered logs or copy logs for debugging/sharing.

---

## Scope

**In scope:**
- Clear button: clears displayed logs (not WS connection)
- Copy button: copies all displayed logs to clipboard
- Toolbar above log display
- "Copied!" confirmation for 2 seconds

**Out of scope:**
- Download as file
- Search/filter in logs

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. Clear and Copy buttons in toolbar
2. Clear empties display, new logs still stream
3. Copy puts all lines in clipboard
4. "Copied!" shows briefly after copy

---

## Implementation Guidelines

### Key files to modify or create
- `src/components/LogViewer.tsx` — Add toolbar

### Architecture constraints
- Clear does NOT disconnect WS
- Copy uses navigator.clipboard API

### Suggested approach
1. Add toolbar with Clear and Copy buttons
2. Clear: set logLines to empty array
3. Copy: use navigator.clipboard.writeText()
4. Show "Copied!" tooltip for 2 seconds

### Testing approach
- Clear → logs disappear, new logs stream
- Copy → clipboard contains all lines
- "Copied!" shows briefly

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] Clear button clears displayed logs
- [ ] Copy button copies to clipboard
- [ ] Clear does NOT disconnect WS
- [ ] "Copied!" shows after copy
- [ ] New logs still stream after clear
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented clear/copy as described
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: add clear and copy functionality to LogViewer`

---

## References

- Depends on: D-1.04 (LogViewer component)

---

# [Phase 1] Container page URL persistence

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard should persist the active tab in the URL so it survives page refresh.

---

## Problem

Without URL persistence, users always start on the Containers tab after refresh, even if they were on Accounts.

---

## Scope

**In scope:**
- Update URL on tab change using pushState
- Read URL on page load to restore tab
- Handle back/forward navigation
- Default to /containers if no URL

**Out of scope:**
- Full client-side router (React Router)
- Deep linking to specific items

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. URL shows /containers when on Containers tab
2. Refresh page → correct tab restored
3. Browser back → previous tab
4. Default to /containers for unknown URLs

---

## Implementation Guidelines

### Key files to modify or create
- `src/App.tsx` — Add URL persistence

### Architecture constraints
- Use pushState, not hash routing
- Handle popstate for back/forward

### Suggested approach
1. Read initial tab from window.location.pathname
2. On tab change, call pushState
3. Listen for popstate event

### Testing approach
- Navigate to Containers → URL shows /containers
- Refresh → tab restored
- Browser back → previous tab

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] URL updates on tab change
- [ ] Tab restored on page refresh
- [ ] Browser back/forward works
- [ ] Default to /containers for unknown URLs
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented URL persistence as described
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: persist active tab in URL`

---

## References

- `src/App.tsx` — tab routing logic

---

# [Phase 1] React error boundary for Containers page

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Small
> **Points:** 150
> **Estimated time:** 2-4 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard needs error boundaries to prevent component crashes from taking down the entire app.

---

## Problem

A malformed response from core that throws during render crashes the entire page. Error boundaries catch these errors and show a fallback UI.

---

## Scope

**In scope:**
- ErrorBoundary class component
- Wrap each page in error boundary
- Show "Something went wrong" on error
- "Try Again" button to reset

**Out of scope:**
- Error logging or reporting
- Recovery from specific error types

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. ErrorBoundary component exists
2. Wraps each page in App.tsx
3. Catches render errors
4. Shows error message with "Try Again"
5. "Try Again" remounts the component

---

## Implementation Guidelines

### Key files to modify or create
- `src/components/ErrorBoundary.tsx` — New class component
- `src/App.tsx` — Wrap pages with ErrorBoundary

### Architecture constraints
- Error boundaries MUST be class components (React limitation)
- Apply to all pages, not just Containers

### Suggested approach
1. Create ErrorBoundary class component
2. Implement componentDidCatch and getDerivedStateFromError
3. Wrap each page in App.tsx

### Testing approach
- Trigger error in a component → boundary catches it
- Click "Try Again" → component remounts

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] ErrorBoundary component exists
- [ ] Wraps each page
- [ ] Catches render errors
- [ ] Shows error message
- [ ] "Try Again" resets boundary
- [ ] Tests verify error catching
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented ErrorBoundary as described
- [ ] I have wrapped all pages
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: add React error boundary for Containers page`

---

## References

- `ARCHITECTURE.md` → "Known Failure Modes" → React error boundaries

---

# [Phase 1] Container status auto-refresh tuning

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard's auto-refresh should be smarter — faster during container transitions, slower when stable.

---

## Problem

Fixed 3-second refresh is either too slow during transitions or too fast when nothing is changing.

---

## Scope

**In scope:**
- Dynamic refetchInterval based on container states
- "starting" state → refresh every 1s
- All stable → refresh every 5s
- Default → 3s

**Out of scope:**
- WebSocket-based status updates
- Manual refresh button

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. Refresh speeds up to 1s when any container is "starting"
2. Refresh slows to 5s when all containers stable
3. No unnecessary refetches

---

## Implementation Guidelines

### Key files to modify or create
- `src/pages/containers/ContainersPage.tsx` — Adjust refetchInterval

### Architecture constraints
- Use React Query's refetchInterval function form
- Don't over-optimize — keep simple

### Suggested approach
1. Use refetchInterval as a function
2. Check container states
3. Return appropriate interval

### Testing approach
- Start container → refresh speeds up
- Container stable → refresh slows

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] Dynamic refetchInterval based on state
- [ ] 1s when any container starting
- [ ] 5s when all stable
- [ ] No unnecessary refetches
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have tuned auto-refresh as described
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: tune container status auto-refresh based on state`

---

## References

- `ARCHITECTURE.md` → "Connection & State Handling"

---

# [Phase 1] Container page CSS styles

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard needs comprehensive CSS styles for all Containers page components.

---

## Problem

Without consistent styles, the page looks unpolished and components don't match visually.

---

## Scope

**In scope:**
- Container card styles (border, padding, shadow)
- Status badge colors (green/yellow/red)
- Log viewer styles (dark bg, monospace)
- Loading spinner animation
- Error state styling
- Responsive media queries

**Out of scope:**
- CSS modules (plain CSS for V1)
- Dark mode
- Animations beyond loading spinner

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. All components are styled consistently
2. Status badges have correct colors
3. Log viewer has terminal appearance
4. Loading spinner animates
5. Error state is visually distinct
6. Responsive at different screen sizes

---

## Implementation Guidelines

### Key files to modify or create
- `src/index.css` — Add all styles

### Architecture constraints
- Use plain CSS (not CSS modules)
- Keep styles in one file for V1
- Functional and clean, not fancy

### Suggested approach
1. Add styles for each component class
2. Add media queries for responsive
3. Add loading spinner animation
4. Add error state styles

### Testing approach
- Visual inspection at multiple screen sizes
- All components styled consistently

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] Container card styles exist
- [ ] Status badge colors correct
- [ ] Log viewer terminal style
- [ ] Loading spinner animates
- [ ] Error state styled
- [ ] Responsive media queries
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have added CSS styles as described
- [ ] I have tested at multiple screen sizes
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: add CSS styles for Containers page`

---

## References

- `ARCHITECTURE.md` → "Tech Stack" → Styling

---

# [Phase 1] API client methods for container operations

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard's API client needs typed methods for container operations. This issue verifies and types them.

---

## Problem

Without typed API methods, the dashboard may call endpoints incorrectly or handle errors inconsistently.

---

## Scope

**In scope:**
- Verify listContainers() works correctly
- Verify startContainer() works correctly
- Verify stopContainer() works correctly
- Add TypeScript types for all responses
- Handle errors consistently

**Out of scope:**
- Client generation from OpenAPI (Phase 0)
- New endpoints

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. All container API methods exist and work
2. TypeScript types match core's OpenAPI
3. Error handling is consistent
4. Methods handle edge cases (empty list, not found)

---

## Implementation Guidelines

### Key files to modify or create
- `src/api/client.ts` — Verify/update container methods

### Architecture constraints
- Types should match core's openapi.yaml exactly
- Error handling consistent across methods

### Suggested approach
1. Verify each method against running core
2. Update TypeScript types
3. Ensure error handling is consistent

### Testing approach
- Manual test each method against running core
- Verify TypeScript types compile

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] listContainers() works correctly
- [ ] startContainer() works correctly
- [ ] stopContainer() works correctly
- [ ] TypeScript types match core API
- [ ] Error handling is consistent
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have verified API methods as described
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: verify and type container API client methods`

---

## References

- `src/api/client.ts` — the file to update
- `api/openapi.yaml` — type source of truth

---

# [Phase 1] Container page integration test

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Small
> **Points:** 150
> **Estimated time:** 2-4 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard's Containers page needs integration tests with mocked API responses.

---

## Problem

Without tests, changes to the Containers page may break rendering or behavior silently.

---

## Scope

**In scope:**
- Create `src/pages/containers/ContainersPage.test.tsx`
- Use React Testing Library
- Mock API client responses
- Test: renders containers, shows correct status, buttons disabled correctly

**Out of scope:**
- E2E tests (Phase 5)
- Visual regression tests

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. Test file exists
2. API client is mocked
3. Tests verify: container names render, status badges correct, buttons disabled correctly
4. Tests verify: loading state, error state
5. All tests pass

---

## Implementation Guidelines

### Key files to modify or create
- `src/pages/containers/ContainersPage.test.tsx` — New test file

### Architecture constraints
- Use React Testing Library, not Enzyme
- Mock API client, not fetch directly
- Test user-visible behavior

### Suggested approach
1. Mock api/client module
2. Write tests with controlled mock data
3. Verify rendering and interactions

### Testing approach
- Render with mock data → verify containers show
- Verify status badge colors
- Verify button disabled states

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] Test file exists
- [ ] API client is mocked
- [ ] Tests verify container rendering
- [ ] Tests verify status badges
- [ ] Tests verify button states
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have implemented tests as described
- [ ] Tests use React Testing Library
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`test: add Containers page integration test`

---

## References

- `ARCHITECTURE.md` → "Testing expectations"

---

# [Phase 1] Container page accessibility basics

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard should be accessible. This issue adds basic accessibility features to the Containers page.

---

## Problem

Without accessibility features, the page is unusable for keyboard-only users and screen reader users.

---

## Scope

**In scope:**
- ARIA labels on all buttons
- Semantic HTML (article, section)
- Keyboard navigation (Tab, Enter, Space)
- Screen reader text for status badges
- Visible focus styles

**Out of scope:**
- Full WCAG audit (Phase 5)
- Color contrast testing
- ARIA live regions

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. All buttons have aria-label
2. Container cards use semantic HTML
3. Tab navigation works
4. Status badges have screen reader text
5. Focus styles are visible

---

## Implementation Guidelines

### Key files to modify or create
- `src/components/ContainerCard.tsx` — Add a11y attributes
- `src/components/StatusBadge.tsx` — Add sr-only text
- `src/index.css` — Add focus styles

### Architecture constraints
- Focus styles are critical — don't remove outline
- Use sr-only class for screen reader text

### Suggested approach
1. Add aria-label to buttons
2. Use <article> for cards
3. Add role="status" to badges
4. Add sr-only text
5. Add focus styles in CSS

### Testing approach
- Tab through all interactive elements → focus visible
- Screen reader announces status correctly

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] All buttons have aria-label
- [ ] Semantic HTML used
- [ ] Keyboard navigation works
- [ ] Status badges have sr-only text
- [ ] Focus styles visible
- [ ] All tests pass
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have added accessibility features as described
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`feat: add basic accessibility to Containers page`

---

## References

- `ARCHITECTURE.md` → "Non-Goals" → responsive (but basic a11y is always in scope)

---

# [Phase 1] Containers page README and documentation

> **Repository:** stellaryard-dashboard
> **Phase:** Phase 1 — Containers Page
> **Complexity:** Trivial
> **Points:** 100
> **Estimated time:** 1-2 hours

---

## Repo Context

> ⚠️ **Before starting this issue, read the following files in the repo for full context:**
> - `AGENTS.md` — Non-negotiable rules for all contributors
> - `ARCHITECTURE_ESSENTIALS.md` — Quick reference for architecture decisions
> - `ARCHITECTURE.md` — Full architecture document (read if essentials don't cover your question)
> - `ROADMAP.md` — Check that your task is scoped and update it when done

stellaryard-dashboard's README should document the Containers page features.

---

## Problem

Without README documentation, new contributors don't know what the Containers page does or how it works.

---

## Scope

**In scope:**
- Document Containers page functionality
- Document log viewer features
- Document action buttons
- Document auto-refresh behavior
- Document "disconnected from core" behavior

**Out of scope:**
- Implementation details
- API documentation (core's responsibility)

---

## What "Done" Looks Like

> A contributor should be able to read this section and know exactly when to stop.

1. README documents Containers page features
2. Log viewer features documented
3. Action buttons documented
4. Auto-refresh behavior documented
5. README renders correctly on GitHub

---

## Implementation Guidelines

### Key files to modify or create
- `README.md` — Update with Containers page docs

### Architecture constraints
- Focus on user-facing behavior, not implementation
- Include enough detail for new contributors

### Suggested approach
1. Update README with Containers page section
2. Document each feature
3. Document keyboard shortcuts (if any)

### Testing approach
- Verify README renders on GitHub
- Verify all documented features work

---

## Acceptance Criteria

> PRs that don't meet ALL of these criteria will be sent back for revision.

- [ ] README documents Containers page
- [ ] All features documented
- [ ] README renders correctly
- [ ] All documented features work
- [ ] `ROADMAP.md` is updated
- [ ] No violations of `AGENTS.md` rules

---

## Checklist

> Tick each item in your PR description to confirm completion.

- [ ] I have read `AGENTS.md`, `ARCHITECTURE_ESSENTIALS.md`, and `ROADMAP.md`
- [ ] I understand the non-negotiable rules for this repo
- [ ] I have updated README as described
- [ ] All existing tests still pass
- [ ] I have updated `ROADMAP.md`
- [ ] I have included a clear commit message
- [ ] I have not violated any rules in `AGENTS.md`

---

## Example Commit Message

`docs: update README with Containers page documentation`

---

## References

- `README.md` — the file to update
