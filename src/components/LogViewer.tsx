import { useEffect, useRef, useState } from "react";

interface LogViewerProps {
  containerName: string;
}

// LogViewer displays real-time container logs via WebSocket.
// TODO: Implement WS connection to /api/v1/containers/{name}/logs
// TODO: Add reconnection with exponential backoff on WS drop
// TODO: Add virtualized rendering for high-throughput logs (react-window)
export function LogViewer({ containerName }: LogViewerProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: connect to WS endpoint
    // const ws = new WebSocket(`ws://localhost:8080/api/v1/containers/${containerName}/logs`);
    // ws.onmessage = (e) => setLogs((prev) => [...prev, e.data]);
    // return () => ws.close();

    setLogs([`[logs for ${containerName} — not yet connected]`]);
  }, [containerName]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="log-viewer">
      <pre className="log-content">
        {logs.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div ref={endRef} />
      </pre>
    </div>
  );
}
