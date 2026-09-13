import type { Transaction } from "../types";

interface TxTableProps {
  transactions: Transaction[];
}

// TxTable renders recent transactions. Status is announced to screen readers
// as text, not just a color emoji (a11y basics, Phase 5).
export function TxTable({ transactions }: TxTableProps) {
  if (transactions.length === 0) {
    return <div className="empty-state">No transactions found</div>;
  }

  return (
    <div className="table-scroll">
      <table className="tx-table">
        <caption className="sr-only">
          Recent transactions, newest first
        </caption>
        <thead>
          <tr>
            <th scope="col">Hash</th>
            <th scope="col">Source</th>
            <th scope="col">Fee</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.hash}>
              <td className="cell-mono">{tx.hash}</td>
              <td className="cell-truncate">{tx.source}</td>
              <td>{tx.fee}</td>
              <td>
                <span aria-hidden="true">{tx.success ? "✅" : "❌"}</span>{" "}
                <span className="sr-only">
                  {tx.success ? "Success" : "Failed"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
