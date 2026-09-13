import { useQuery } from "@tanstack/react-query";
import { getLedgerSnapshot, listTransactions } from "../../api/client";
import { TxTable } from "../../components/TxTable";

export function LedgerPage() {
  const {
    data: snapshot,
    isLoading: snapshotLoading,
    error: snapshotError,
  } = useQuery({
    queryKey: ["ledger", "snapshot"],
    queryFn: getLedgerSnapshot,
    refetchInterval: 5_000,
  });

  const {
    data: transactions,
    isLoading: txLoading,
    error: txError,
  } = useQuery({
    queryKey: ["ledger", "transactions"],
    queryFn: () => listTransactions(20, 0),
    refetchInterval: 5_000,
  });

  if (snapshotLoading || txLoading) {
    return (
      <div className="loading" role="status">
        <span className="spinner" aria-hidden="true" />
        Loading ledger...
      </div>
    );
  }

  return (
    <div className="ledger-page">
      <h2>Ledger</h2>

      {snapshotError && (
        <div className="error">Failed to load ledger snapshot</div>
      )}
      <section className="snapshot" aria-label="Ledger snapshot">
        <h3>Ledger Snapshot</h3>
        {snapshot ? (
          <div className="snapshot-data" role="status">
            <span>Sequence: {snapshot.sequence}</span>
            <span>Transactions: {snapshot.txCount}</span>
            <span>Updated: {new Date(snapshot.timestamp).toLocaleString()}</span>
          </div>
        ) : (
          !snapshotError && <div>No snapshot available</div>
        )}
      </section>

      <h3>Recent Transactions</h3>
      {txError && <div className="error">Failed to load transactions</div>}
      {!txError && (transactions?.length ?? 0) === 0 ? (
        <div className="empty-state">No transactions found</div>
      ) : (
        transactions && <TxTable transactions={transactions} />
      )}
    </div>
  );
}
