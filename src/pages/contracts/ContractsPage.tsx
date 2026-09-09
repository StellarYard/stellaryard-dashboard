import { useQuery } from "@tanstack/react-query";
import { listContainers } from "../../api/client";

export function ContractsPage() {
  // TODO: use actual contract list endpoint when available
  const { data: _containers } = useQuery({
    queryKey: ["containers"],
    queryFn: listContainers,
  });

  return (
    <div className="contracts-page">
      <h2>Contracts</h2>

      <div className="deploy-form">
        <h3>Deploy Contract</h3>
        <div className="form-group">
          <label>WASM File</label>
          <input type="file" accept=".wasm" />
        </div>
        <button>Deploy</button>
      </div>

      <div className="invoke-form">
        <h3>Invoke Contract</h3>
        <div className="form-group">
          <label>Contract ID</label>
          <input type="text" placeholder="C..." />
        </div>
        <div className="form-group">
          <label>Method</label>
          <input type="text" placeholder="method_name" />
        </div>
        <div className="form-group">
          <label>Arguments (comma-separated)</label>
          <input type="text" placeholder="arg1, arg2" />
        </div>
        <button>Invoke</button>
      </div>

      <h3>Deployment History</h3>
      <div className="empty-state">
        No deployments yet. Deploy a WASM contract to get started.
      </div>
    </div>
  );
}
