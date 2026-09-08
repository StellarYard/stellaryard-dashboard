import { useEffect, useState } from "react";
import { checkConnection } from "../api/client";

// Polls core's API to determine connection status.
// Returns false if core is unreachable.
export function useConnectionStatus(intervalMs = 5000): boolean {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let active = true;

    const poll = async () => {
      const status = await checkConnection();
      if (active) {
        setConnected(status);
      }
    };

    poll();
    const interval = setInterval(poll, intervalMs);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [intervalMs]);

  return connected;
}
