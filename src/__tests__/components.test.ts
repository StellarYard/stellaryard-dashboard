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
