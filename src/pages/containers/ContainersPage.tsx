import { useQuery } from "@tanstack/react-query";
import { listContainers } from "../../api/client";
import { ContainerCard } from "../../components/ContainerCard";
import { LogViewer } from "../../components/LogViewer";

export function ContainersPage() {
  const {
    data: containers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["containers"],
    queryFn: listContainers,
    refetchInterval: 3_000,
  });

  if (isLoading) return <div className="loading">Loading containers...</div>;
  if (error) return <div className="error">Failed to load containers</div>;

  return (
    <div className="containers-page">
      <h2>Containers</h2>
      <div className="container-list">
        {containers?.length === 0 && (
          <div className="empty-state">No containers found</div>
        )}
        {containers?.map((c) => (
          <ContainerCard
            key={c.name}
            name={c.name}
            state={c.state}
            health={c.health}
            started={c.started}
          />
        ))}
      </div>

      <h3>Logs</h3>
      <LogViewer />
    </div>
  );
}
