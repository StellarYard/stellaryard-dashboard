interface StatusBadgeProps {
  status: string;
  health: string;
}

// StatusBadge shows container state at a glance; the visually hidden text
// gives screen readers a full sentence instead of just the color-coded label.
export function StatusBadge({ status, health }: StatusBadgeProps) {
  const color =
    status === "running" && health === "healthy"
      ? "green"
      : status === "running"
        ? "yellow"
        : "red";

  const description = `Container is ${status}${health ? ` and ${health}` : ""}`;

  return (
    <span className={`status-badge status-${color}`} role="status">
      {status}
      {health && ` (${health})`}
      <span className="sr-only">. {description}.</span>
    </span>
  );
}
