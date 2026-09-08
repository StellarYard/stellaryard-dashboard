import { useQuery } from "@tanstack/react-query";
import { listContainers } from "../../api/client";
import { StatusBadge } from "../../components/StatusBadge";
import { LogViewer } from "../../components/LogViewer";

export function ContainersPage() {
  const { data: containers, isLoading, error } = useQuery({
    queryKey: ["containers"],
    queryFn: listContainers,
    refetchInterval: 3_000,
  });

  if (isLoading) return <div>Loading containers...</div>;
  if (error) return <div className="error">Failed to load containers</div>;

  return (
    <div className="containers-page">
      <h2>Containers</h2>
      <div className="container-list">
        {containers?.map((c) => (
          <div key={c.name} className="container-card">
            <h3>{c.name}</h3>
            <StatusBadge status={c.state} health={c.health} />
            <div className="container-actions">
              <button disabled={c.state === "running"}>Start</button>
              <button disabled={c.state === "stopped"}>Stop</button>
              <button>Restart</button>
            </div>
          </div>
        ))}
      </div>

      <h3>Logs</h3>
      {/* TODO: implement LogViewer with WS streaming */}
      <LogViewer containerName="horizon" />
    </div>
  );
}
