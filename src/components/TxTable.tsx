import type { Transaction } from "../types";

interface TxTableProps {
  transactions: Transaction[];
}

export function TxTable({ transactions }: TxTableProps) {
  if (transactions.length === 0) {
    return <div className="empty-state">No transactions found</div>;
  }

  return (
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
        {transactions.map((tx) => (
          <tr key={tx.hash}>
            <td>{tx.hash}</td>
            <td>{tx.source}</td>
            <td>{tx.fee}</td>
            <td>{tx.success ? "✅" : "❌"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
