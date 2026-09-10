import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listContainers,
  restartContainer,
  startContainer,
  stopContainer,
} from "../../api/client";
import { StatusBadge } from "../../components/StatusBadge";
import { LogViewer } from "../../components/LogViewer";

export function ContainersPage() {
  const queryClient = useQueryClient();
  const {
    data: containers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["containers"],
    queryFn: listContainers,
    refetchInterval: 3_000,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["containers"] });

  const start = useMutation({ mutationFn: startContainer, onSuccess: invalidate });
  const stop = useMutation({ mutationFn: stopContainer, onSuccess: invalidate });
  const restart = useMutation({
    mutationFn: restartContainer,
    onSuccess: invalidate,
  });

  const busy = start.isPending || stop.isPending || restart.isPending;
  const actionError = start.error ?? stop.error ?? restart.error;

  if (isLoading) return <div>Loading containers...</div>;
  if (error) return <div className="error">Failed to load containers</div>;

  return (
    <div className="containers-page">
      <h2>Containers</h2>
      {actionError && (
        <div className="error">Container action failed: {String(actionError)}</div>
      )}
      <div className="container-list">
        {containers?.map((c) => (
          <div key={c.name} className="container-card">
            <h3>{c.name}</h3>
            <StatusBadge status={c.state} health={c.health} />
            <div className="container-actions">
              <button
                disabled={busy || c.state === "running"}
                onClick={() => start.mutate(c.name)}
              >
                Start
              </button>
              <button
                disabled={busy || c.state === "stopped"}
                onClick={() => stop.mutate(c.name)}
              >
                Stop
              </button>
              <button disabled={busy} onClick={() => restart.mutate(c.name)}>
                Restart
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3>Logs</h3>
      <LogViewer containerName="horizon" />
    </div>
  );
}