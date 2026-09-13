import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (p: string) => readFileSync(resolve(import.meta.dirname, p), "utf-8");

describe("ErrorBoundary", () => {
  const content = read("../components/ErrorBoundary.tsx");

  it("file exists and exports class component", () => {
    assert.ok(content.includes("export class ErrorBoundary"));
  });

  it("implements React error boundary lifecycle", () => {
    assert.ok(content.includes("getDerivedStateFromError"));
    assert.ok(content.includes("componentDidCatch"));
  });

  it("offers a Try Again reset", () => {
    assert.ok(content.includes("Try Again"));
  });
});

describe("URL persistence in App", () => {
  const content = read("../App.tsx");

  it("uses pushState for tab changes and handles popstate", () => {
    assert.ok(content.includes("pushState"));
    assert.ok(content.includes("popstate"));
  });

  it("restores tab from URL on load", () => {
    assert.ok(content.includes("window.location.pathname"));
  });

  it("wraps pages in an ErrorBoundary", () => {
    assert.ok(content.includes("<ErrorBoundary"));
  });
});

describe("ContainerCard", () => {
  const content = read("../components/ContainerCard.tsx");

  it("file exists and exports component", () => {
    assert.ok(content.includes("export function ContainerCard"));
  });

  it("renders name, status badge, and started time", () => {
    assert.ok(content.includes("<h3>{name}</h3>"));
    assert.ok(content.includes("<StatusBadge"));
    assert.ok(content.includes("Started:"));
  });

  it("has start/stop/restart buttons disabled by state", () => {
    assert.ok(content.includes('disabled={busy || state === "running"}'));
    assert.ok(content.includes('disabled={busy || state === "stopped"}'));
    assert.ok(content.includes('disabled={busy || state === "error"}'));
  });

  it("invalidates the containers query after mutations", () => {
    assert.ok(content.includes('queryKey: ["containers"]'));
  });
});

describe("LogViewer container selector", () => {
  const content = read("../components/LogViewer.tsx");

  it("offers horizon and soroban-rpc selector buttons", () => {
    assert.ok(content.includes('"horizon"'));
    assert.ok(content.includes('"soroban-rpc"'));
  });

  it("keeps WS logic keyed by container so switches reconnect and clear logs", () => {
    assert.ok(content.includes("key={container}"));
    assert.ok(content.includes("useEffect"));
  });

  it("retains exponential backoff reconnection", () => {
    assert.ok(content.includes("1000 * 2 **"));
  });

  it("stops reconnecting after 5 attempts and shows Connection lost", () => {
    assert.ok(content.includes("MAX_ATTEMPTS = 5"));
    assert.ok(content.includes("Connection lost"));
    assert.ok(content.includes("Retry"));
  });

  it("virtualizes rendering with react-window and caps buffer at 1000", () => {
    assert.ok(content.includes('from "react-window"'));
    assert.ok(content.includes("rowComponent={LogRow}"));
    assert.ok(content.includes("MAX_LINES = 1000"));
  });
});

describe("Containers page loading + refresh tuning", () => {
  const content = read("../pages/containers/ContainersPage.tsx");

  it("tunes refetchInterval by container state", () => {
    assert.ok(content.includes("refetchIntervalFor"));
    assert.ok(content.includes("1_000")); // transitioning
    assert.ok(content.includes("5_000")); // stable
  });

  it("shows spinner and skeleton placeholders while loading", () => {
    assert.ok(content.includes('className="spinner"'));
    assert.ok(content.includes("skeleton-card"));
    assert.ok(content.includes('role="status"'));
  });

  it("only shows empty state after load completes", () => {
    // Empty state render must come after the isLoading early-return.
    const loadIdx = content.indexOf("isLoading");
    const emptyIdx = content.indexOf("No containers found");
    assert.ok(loadIdx !== -1 && emptyIdx > loadIdx);
  });
});

describe("LogViewer clear/copy toolbar", () => {
  const content = read("../components/LogViewer.tsx");

  it("has Clear and Copy buttons with labels", () => {
    assert.ok(content.includes('aria-label="Clear displayed logs"'));
    assert.ok(content.includes('aria-label="Copy all displayed logs to clipboard"'));
  });

  it("clear only empties the display, not the WS connection", () => {
    assert.ok(content.includes("const clearLogs = () => setLogs([]);"));
  });

  it("copies via navigator.clipboard with Copied confirmation", () => {
    assert.ok(content.includes("navigator.clipboard.writeText"));
    assert.ok(content.includes("Copied!"));
  });
});

describe("Container action button polish", () => {
  const content = read("../components/ContainerCard.tsx");

  it("shows a spinner on the mutating button", () => {
    assert.ok(content.includes("button-spinner"));
    assert.ok(content.includes("start.isPending"));
  });

  it("flashes success after an action completes", () => {
    assert.ok(content.includes("flash-success"));
    assert.ok(content.includes("succeedWith"));
  });

  it("locks all buttons while a mutation is pending", () => {
    assert.ok(content.includes(
      "start.isPending || stop.isPending || restart.isPending"
    ));
  });
});

describe("Accessibility basics", () => {
  const badge = read("../components/StatusBadge.tsx");
  const card = read("../components/ContainerCard.tsx");
  const css = read("../index.css");

  it("status badges announce a full description to screen readers", () => {
    assert.ok(badge.includes('role="status"'));
    assert.ok(badge.includes("sr-only"));
  });

  it("action buttons have aria-labels and cards use semantic HTML", () => {
    assert.ok(card.includes("aria-label="));
    assert.ok(card.includes("<article"));
  });

  it("CSS provides visible focus styles and sr-only utility", () => {
    assert.ok(css.includes(":focus-visible"));
    assert.ok(css.includes(".sr-only"));
  });

  it("CSS has responsive breakpoints and spinner animation", () => {
    assert.ok(css.includes("@media"));
    assert.ok(css.includes("@keyframes spin"));
  });
});

describe("README documents the Containers page", () => {
  const content = read("../../README.md");

  it("documents log viewer, buttons, refresh, and disconnect behavior", () => {
    assert.ok(content.includes("## Containers Page"));
    assert.ok(content.includes("**Auto-refresh:**"));
    assert.ok(content.includes("Connection loss & recovery"));
    assert.ok(content.includes("Retry"));
  });
});
