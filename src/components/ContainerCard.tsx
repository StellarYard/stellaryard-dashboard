import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restartContainer, startContainer, stopContainer } from "../api/client";
import { StatusBadge } from "./StatusBadge";

interface ContainerCardProps {
  name: string;
  state: "running" | "stopped" | "error";
  health: "healthy" | "unhealthy" | "starting";
  started: string;
}

// startedLabel formats an ISO timestamp as human-readable local time,
// tolerating missing/unparseable values from core.
function startedLabel(started: string): string {
  if (!started) return "—";
  const date = new Date(started);
  if (Number.isNaN(date.getTime())) return started;
  return date.toLocaleString();
}

// ContainerCard renders a single container's status and lifecycle actions.
// Display-only for status; buttons issue mutations and invalidate the
// containers query so status refreshes after each action.
export function ContainerCard({ name, state, health, started }: ContainerCardProps) {
  const queryClient = useQueryClient();

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

  return (
    <article className="container-card">
      <h3>{name}</h3>
      <StatusBadge status={state} health={health} />
      <p className="container-started">
        Started: <time dateTime={started || undefined}>{startedLabel(started)}</time>
      </p>
      {actionError && (
        <div className="error">Container action failed: {String(actionError)}</div>
      )}
      <div className="container-actions">
        <button
          aria-label={`Start container ${name}`}
          disabled={busy || state === "running"}
          onClick={() => start.mutate(name)}
        >
          Start
        </button>
        <button
          aria-label={`Stop container ${name}`}
          disabled={busy || state === "stopped"}
          onClick={() => stop.mutate(name)}
        >
          Stop
        </button>
        <button
          aria-label={`Restart container ${name}`}
          disabled={busy || state === "error"}
          onClick={() => restart.mutate(name)}
        >
          Restart
        </button>
      </div>
    </article>
  );
}
