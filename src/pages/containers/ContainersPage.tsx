import { useQuery } from "@tanstack/react-query";
import { listContainers } from "../../api/client";
import type { ContainerStatus } from "../../types";
import { ContainerCard } from "../../components/ContainerCard";
import { LogViewer } from "../../components/LogViewer";

// Refresh cadence (Phase 1 tuning): poll fast while a container is
// transitioning, slower once everything is stable. The 3s default covers
// the initial state before any data has arrived.
function refetchIntervalFor(containers?: ContainerStatus[]): number {
  if (!containers) return 3_000;
  const transitioning = containers.some((c) => c.health === "starting");
  return transitioning ? 1_000 : 5_000;
}

export function ContainersPage() {
  const {
    data: containers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["containers"],
    queryFn: listContainers,
    refetchInterval: (query) => refetchIntervalFor(query.state.data),
  });

  if (isLoading) {
    return (
      <div className="containers-page">
        <h2>Containers</h2>
        <div className="loading" role="status">
          <span className="spinner" aria-hidden="true" />
          Loading containers...
        </div>
        {/* Skeleton placeholders so layout doesn't jump when data arrives. */}
        <div className="container-list" aria-hidden="true">
          {[0, 1].map((i) => (
            <div key={i} className="container-card skeleton-card">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-badge" />
              <div className="skeleton skeleton-text" />
            </div>
          ))}
        </div>
      </div>
    );
  }

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
