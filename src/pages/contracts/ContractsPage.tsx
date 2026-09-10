import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deployContractFile,
  invokeContract,
  listDeployments,
} from "../../api/client";
import { DeployForm } from "../../components/DeployForm";
import type { InvokeResult } from "../../types";

export function ContractsPage() {
  const queryClient = useQueryClient();

  const deployments = useQuery({
    queryKey: ["contracts", "deployments"],
    queryFn: listDeployments,
  });

  const deploy = useMutation({
    mutationFn: (file: File) => deployContractFile(file),
    onSuccess: (dep) => {
      queryClient.invalidateQueries({ queryKey: ["contracts", "deployments"] });
      setDeployResult(`Deployed: ${dep.contractId}`);
    },
  });

  // Invoke form state
  const [contractId, setContractId] = useState("");
  const [method, setMethod] = useState("");
  const [args, setArgs] = useState("");
  const [sourceAccount, setSourceAccount] = useState("");
  const [invokeResult, setInvokeResult] = useState<InvokeResult | null>(null);
  const [deployResult, setDeployResult] = useState<string | null>(null);

  const invoke = useMutation({
    mutationFn: () =>
      invokeContract(contractId.trim(), {
        method: method.trim(),
        args: args
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a.length > 0),
        sourceAccount: sourceAccount.trim() || undefined,
      }),
    onSuccess: (result) => setInvokeResult(result),
  });

  const handleInvoke = (e: React.FormEvent) => {
    e.preventDefault();
    if (contractId.trim() && method.trim()) {
      setInvokeResult(null);
      invoke.mutate();
    }
  };

  return (
    <div className="contracts-page">
      <h2>Contracts</h2>

      <h3>Deploy Contract</h3>
      {deployResult && <div className="success">{deployResult}</div>}
      {deploy.error && (
        <div className="error">Deployment failed: {String(deploy.error)}</div>
      )}
      <DeployForm onDeploy={(file) => deploy.mutate(file)} disabled={deploy.isPending} />

      <h3>Invoke Contract</h3>
      {invoke.error && (
        <div className="error">Invocation failed: {String(invoke.error)}</div>
      )}
      {invokeResult && (
        <div className="invoke-result">
          <div>Transaction: {invokeResult.txHash}</div>
          <div>Status: {invokeResult.status}</div>
          {invokeResult.resultXdr && <div>Result XDR: {invokeResult.resultXdr}</div>}
        </div>
      )}
      <form className="invoke-form" onSubmit={handleInvoke}>
        <div className="form-group">
          <label htmlFor="contract-id">Contract ID</label>
          <input
            id="contract-id"
            type="text"
            placeholder="C..."
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contract-method">Method</label>
          <input
            id="contract-method"
            type="text"
            placeholder="method_name"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contract-args">Arguments (comma-separated)</label>
          <input
            id="contract-args"
            type="text"
            placeholder="arg1, arg2"
            value={args}
            onChange={(e) => setArgs(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contract-source">Source Account (optional)</label>
          <input
            id="contract-source"
            type="text"
            placeholder="G... (defaults to most recent account)"
            value={sourceAccount}
            onChange={(e) => setSourceAccount(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={!contractId.trim() || !method.trim() || invoke.isPending}
        >
          {invoke.isPending ? "Invoking…" : "Invoke"}
        </button>
      </form>

      <h3>Deployment History</h3>
      {deployments.isLoading ? (
        <div>Loading deployments...</div>
      ) : deployments.data && deployments.data.length > 0 ? (
        <table className="deploy-table">
          <thead>
            <tr>
              <th>Contract ID</th>
              <th>WASM Hash</th>
              <th>Deployed By</th>
              <th>Network</th>
            </tr>
          </thead>
          <tbody>
            {deployments.data.map((d) => (
              <tr key={d.id}>
                <td>{d.contractId}</td>
                <td>{d.wasmHash}</td>
                <td>{d.deployedBy}</td>
                <td>{d.network}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          No deployments yet. Deploy a WASM contract to get started.
        </div>
      )}
    </div>
  );
}