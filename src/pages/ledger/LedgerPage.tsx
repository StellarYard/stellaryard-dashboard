import { useQuery } from "@tanstack/react-query";
import { getLedgerSnapshot, listTransactions } from "../../api/client";

export function LedgerPage() {
  const { data: snapshot, isLoading: snapshotLoading } = useQuery({
    queryKey: ["ledger", "snapshot"],
    queryFn: getLedgerSnapshot,
    refetchInterval: 5_000,
  });

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ["ledger", "transactions"],
    queryFn: () => listTransactions(20, 0),
    refetchInterval: 5_000,
  });

  if (snapshotLoading || txLoading) return <div>Loading ledger...</div>;

  return (
    <div className="ledger-page">
      <h2>Ledger</h2>

      <div className="snapshot">
        <h3>Ledger Snapshot</h3>
        {snapshot ? (
          <div className="snapshot-data">
            <span>Sequence: {snapshot.sequence}</span>
            <span>Transactions: {snapshot.txCount}</span>
            <span>Updated: {new Date(snapshot.timestamp).toLocaleString()}</span>
          </div>
        ) : (
          <div>No snapshot available</div>
        )}
      </div>

      <h3>Recent Transactions</h3>
      <table className="tx-table">
        <thead>
          <tr>
            <th>Hash</th>
            <th>Source</th>
            <th>Fee</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((tx) => (
            <tr key={tx.hash}>
              <td>{tx.hash}</td>
              <td>{tx.source}</td>
              <td>{tx.fee}</td>
              <td>{tx.success ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
