import { useEffect, useRef, useState } from "react";

interface LogViewerProps {
  containerName: string;
}

const MAX_LINES = 500;

// LogViewer displays real-time container logs via the core WebSocket
// endpoint, reconnecting with exponential backoff on drop.
export function LogViewer({ containerName }: LogViewerProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

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
        setConnected(true);
        retries = 0;
      };

      ws.onmessage = (e) => {
        // Keep the buffer bounded to avoid UI jank on high-throughput logs.
        setLogs((prev) => [...prev.slice(-(MAX_LINES - 1)), String(e.data)]);
      };

      ws.onclose = () => {
        setConnected(false);
        if (closed) return;
        retries += 1;
        reconnectTimer = setTimeout(connect, Math.min(1000 * 2 ** retries, 15_000));
      };

      ws.onerror = () => ws?.close();
    };

    connect();

    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [containerName]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="log-viewer">
      <div className={`log-viewer-status ${connected ? "connected" : ""}`}>
        {connected ? "streaming" : "reconnecting…"}
      </div>
      <pre className="log-content">
        {logs.length === 0 && <div>[waiting for logs…]</div>}
        {logs.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div ref={endRef} />
      </pre>
    </div>
  );
}