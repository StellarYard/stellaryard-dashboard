interface StatusBadgeProps {
  status: string;
  health: string;
}

export function StatusBadge({ status, health }: StatusBadgeProps) {
  const color =
    status === "running" && health === "healthy"
      ? "green"
      : status === "running"
        ? "yellow"
        : "red";

  return (
    <span className={`status-badge status-${color}`}>
      {status}
      {health && ` (${health})`}
    </span>
  );
}
