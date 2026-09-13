import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restartContainer, startContainer, stopContainer } from "../api/client";
import { StatusBadge } from "./StatusBadge";

interface ContainerCardProps {
  name: string;
  state: "running" | "stopped" | "error";
  health: "healthy" | "unhealthy" | "starting";
  started: string;
}

// How long the success flash stays on the card after an action completes.
const FLASH_RESET_MS = 1500;

// startedLabel formats an ISO timestamp as human-readable local time,
// tolerating missing/unparseable values from core.
function startedLabel(started: string): string {
  if (!started) return "—";
  const date = new Date(started);
  if (Number.isNaN(date.getTime())) return started;
  return date.toLocaleString();
}

// ContainerCard renders a single container's status and lifecycle actions.
// Buttons issue mutations (spinner on the clicked button, all buttons locked
// while one is pending) and invalidate the containers query so status
// refreshes after each action. A short flash confirms completion.
export function ContainerCard({ name, state, health, started }: ContainerCardProps) {
  const queryClient = useQueryClient();
  const [flash, setFlash] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  const succeedWith = (message: string) => {
    queryClient.invalidateQueries({ queryKey: ["containers"] });
    setFlash(message);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), FLASH_RESET_MS);
  };

  const start = useMutation({
    mutationFn: startContainer,
    onSuccess: () => succeedWith("Started"),
  });
  const stop = useMutation({
    mutationFn: stopContainer,
    onSuccess: () => succeedWith("Stopped"),
  });
  const restart = useMutation({
    mutationFn: restartContainer,
    onSuccess: () => succeedWith("Restarted"),
  });

  // Lock ALL buttons while any mutation is pending (prevents double-clicks),
  // and keep them locked until the flash clears so the status transition
  // from core is visible.
  const busy =
    start.isPending || stop.isPending || restart.isPending || flash !== null;
  const actionError = start.error ?? stop.error ?? restart.error;

  return (
    <article className={`container-card${flash ? " flash-success" : ""}`}>
      <h3>{name}</h3>
      <StatusBadge status={state} health={health} />
      <p className="container-started">
        Started: <time dateTime={started || undefined}>{startedLabel(started)}</time>
      </p>
      {actionError && (
        <div className="error">Container action failed: {String(actionError)}</div>
      )}
      {flash && (
        <div className="success-flash" role="status">
          {flash} ✓
        </div>
      )}
      <div className="container-actions">
        <button
          aria-label={`Start container ${name}`}
          disabled={busy || state === "running"}
          onClick={() => start.mutate(name)}
        >
          {start.isPending && <span className="button-spinner" aria-hidden="true" />}
          Start
        </button>
        <button
          aria-label={`Stop container ${name}`}
          disabled={busy || state === "stopped"}
          onClick={() => stop.mutate(name)}
        >
          {stop.isPending && <span className="button-spinner" aria-hidden="true" />}
          Stop
        </button>
        <button
          aria-label={`Restart container ${name}`}
          disabled={busy || state === "error"}
          onClick={() => restart.mutate(name)}
        >
          {restart.isPending && <span className="button-spinner" aria-hidden="true" />}
          Restart
        </button>
      </div>
    </article>
  );
}
