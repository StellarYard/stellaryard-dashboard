import { useEffect, useRef, useState } from "react";
import { List, RowComponentProps, type ListImperativeAPI } from "react-window";

type ContainerName = "horizon" | "soroban-rpc";
type StreamStatus = "connecting" | "streaming" | "reconnecting" | "lost";

interface LogViewerProps {
  /** Initial container to stream; defaults to "horizon". */
  initialContainer?: ContainerName;
}

// Buffer cap: oldest lines evicted beyond this (high-throughput safety).
const MAX_LINES = 1000;
// Stop reconnecting after this many consecutive failures.
const MAX_ATTEMPTS = 5;
const ROW_HEIGHT = 18;
const VIEWPORT_HEIGHT = 360;
// How long the "Copied!" confirmation stays visible.
const COPIED_RESET_MS = 2000;

// LogViewer displays real-time container logs via core's WebSocket endpoint,
// with a container selector, virtualized rendering, clear/copy toolbar, and
// automatic reconnection with exponential backoff that stops after
// MAX_ATTEMPTS failures.
export function LogViewer({ initialContainer = "horizon" }: LogViewerProps) {
  const [container, setContainer] = useState<ContainerName>(initialContainer);

  const switchTo = (name: ContainerName) => {
    if (name !== container) setContainer(name);
  };

  return (
    <div className="log-viewer-wrapper">
      <div className="log-selector" role="tablist" aria-label="Container logs">
        <button
          className={container === "horizon" ? "log-tab active" : "log-tab"}
          aria-pressed={container === "horizon"}
          onClick={() => switchTo("horizon")}
        >
          Horizon
        </button>
        <button
          className={container === "soroban-rpc" ? "log-tab active" : "log-tab"}
          aria-pressed={container === "soroban-rpc"}
          onClick={() => switchTo("soroban-rpc")}
        >
          Soroban RPC
        </button>
      </div>
      {/* Keying by container remounts LogStream on switch, which closes the
          previous WS (cleanup) and clears the log buffer (fresh state). */}
      <LogStream key={container} containerName={container} />
    </div>
  );
}

interface LogStreamProps {
  containerName: ContainerName;
}

// Row renderer for the virtualized list; logs are passed via rowProps.
function LogRow({ index, style, logs }: RowComponentProps<{ logs: string[] }>) {
  return (
    <div style={style} className="log-line">
      {logs[index]}
    </div>
  );
}

// LogStream owns a single WebSocket connection for one container.
function LogStream({ containerName }: LogStreamProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<StreamStatus>("connecting");
  const [attempts, setAttempts] = useState(0);
  const [copied, setCopied] = useState(false);
  // Bumping retryToken tears down the effect and starts a fresh connection.
  const [retryToken, setRetryToken] = useState(0);
  const listRef = useRef<ListImperativeAPI>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let retries = 0;
    let closed = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      const proto = window.location.protocol === "https:" ? "wss" : "ws";
      ws = new WebSocket(
        `${proto}://${window.location.host}/api/v1/containers/${containerName}/logs`
      );

      ws.onopen = () => {
        retries = 0;
        setAttempts(0);
        setStatus("streaming");
      };

      ws.onmessage = (e) => {
        // Keep the buffer bounded (oldest evicted) to avoid UI jank.
        setLogs((prev) => [...prev.slice(-(MAX_LINES - 1)), String(e.data)]);
      };

      ws.onclose = () => {
        if (closed) return;
        if (retries >= MAX_ATTEMPTS) {
          setStatus("lost");
          return;
        }
        retries += 1;
        setAttempts(retries);
        setStatus("reconnecting");
        // Exponential backoff: 1s, 2s, 4s, then capped at 8s.
        const delay = Math.min(1000 * 2 ** (retries - 1), 8000);
        reconnectTimer = setTimeout(connect, delay);
      };

      ws.onerror = () => ws?.close();
    };

    connect();

    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [containerName, retryToken]);

  // Reset the "Copied!" confirmation timer on unmount.
  useEffect(() => {
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  // Auto-scroll so the newest line stays in view as logs arrive.
  useEffect(() => {
    if (logs.length > 0) {
      listRef.current?.scrollToRow({ index: logs.length - 1, align: "end" });
    }
  }, [logs]);

  // Clear empties the display only — the WS stays connected and new lines
  // continue streaming in.
  const clearLogs = () => setLogs([]);

  // Copy puts every displayed line on the clipboard (best-effort; clipboard
  // access can be denied in some browser contexts).
  const copyLogs = async () => {
    try {
      await navigator.clipboard.writeText(logs.join("\n"));
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      // Clipboard unavailable/denied — nothing to do; confirmation just won't show.
    }
  };

  const retry = () => {
    setLogs([]);
    setAttempts(0);
    setStatus("connecting");
    setRetryToken((t) => t + 1);
  };

  return (
    <div className="log-viewer">
      <div className="log-toolbar">
        <span className={`log-viewer-status ${status === "streaming" ? "connected" : ""}`}>
          {status === "streaming" && "streaming"}
          {status === "connecting" && "connecting…"}
          {status === "reconnecting" &&
            `reconnecting… (attempt ${attempts}/${MAX_ATTEMPTS})`}
          {status === "lost" && (
            <>
              Connection lost after {MAX_ATTEMPTS} attempts.{" "}
              <button className="log-retry" onClick={retry}>
                Retry
              </button>
            </>
          )}
        </span>
        <span className="log-toolbar-actions">
          <button className="log-tool" aria-label="Clear displayed logs" onClick={clearLogs}>
            Clear
          </button>
          <button
            className="log-tool"
            aria-label="Copy all displayed logs to clipboard"
            disabled={logs.length === 0 || copied}
            onClick={copyLogs}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </span>
      </div>
      {logs.length === 0 ? (
        <div className="log-empty">[waiting for logs…]</div>
      ) : (
        <List
          listRef={listRef}
          className="log-content"
          style={{ height: VIEWPORT_HEIGHT }}
          rowComponent={LogRow}
          rowProps={{ logs }}
          rowCount={logs.length}
          rowHeight={ROW_HEIGHT}
          overscanCount={10}
        />
      )}
    </div>
  );
}
