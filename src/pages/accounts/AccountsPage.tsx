import { useQuery } from "@tanstack/react-query";
import { listAccounts } from "../../api/client";

export function AccountsPage() {
  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: listAccounts,
    refetchInterval: 10_000,
  });

  if (isLoading) return <div>Loading accounts...</div>;
  if (error) return <div className="error">Failed to load accounts</div>;

  return (
    <div className="accounts-page">
      <h2>Accounts</h2>
      <div className="account-actions">
        <button>+ Create Account</button>
      </div>

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
