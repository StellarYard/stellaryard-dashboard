import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAccount, listAccounts } from "../../api/client";

type Network = "local" | "testnet";

export function AccountsPage() {
  const queryClient = useQueryClient();
  const [label, setLabel] = useState("");
  const [network, setNetwork] = useState<Network>("testnet");

  const {
    data: accounts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: listAccounts,
    refetchInterval: 10_000,
  });

  const create = useMutation({
    mutationFn: (l: string) => createAccount({ label: l, network }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setLabel("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label.trim()) {
      create.mutate(label.trim());
    }
  };

  if (isLoading) return <div>Loading accounts...</div>;
  if (error) return <div className="error">Failed to load accounts</div>;

  return (
    <div className="accounts-page">
      <h2>Accounts</h2>

      <form className="account-create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="account-label">Label</label>
          <input
            id="account-label"
            type="text"
            placeholder="my-test-account"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="account-network">Network</label>
          <select
            id="account-network"
            value={network}
            onChange={(e) => setNetwork(e.target.value as Network)}
          >
            <option value="testnet">testnet</option>
            <option value="local">local</option>
          </select>
        </div>
        <button type="submit" disabled={!label.trim() || create.isPending}>
          {create.isPending ? "Creating…" : "+ Create Account"}
        </button>
        {create.error && (
          <div className="error">
            Account creation failed: {String(create.error)}
          </div>
        )}
      </form>

      {accounts?.length === 0 && (
        <div className="empty-state">
          No accounts yet. Create one to get started.
        </div>
      )}

      <table className="account-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Public Key</th>
            <th>Network</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts?.map((a) => (
            <tr key={a.id}>
              <td>{a.label}</td>
              <td>{a.publicKey}</td>
              <td>{a.network}</td>
              <td>{a.balance ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}