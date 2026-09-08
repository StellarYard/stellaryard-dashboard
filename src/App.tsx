import { useState } from "react";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { ContainersPage } from "./pages/containers/ContainersPage";
import { AccountsPage } from "./pages/accounts/AccountsPage";
import { LedgerPage } from "./pages/ledger/LedgerPage";
import { ContractsPage } from "./pages/contracts/ContractsPage";

type Tab = "containers" | "accounts" | "ledger" | "contracts";

const tabs: { id: Tab; label: string }[] = [
  { id: "containers", label: "Containers" },
  { id: "accounts", label: "Accounts" },
  { id: "ledger", label: "Ledger" },
  { id: "contracts", label: "Contracts" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("containers");
  const connected = useConnectionStatus();

  return (
    <div className="app">
      <header className="app-header">
        <h1>StellarYard</h1>
        <span className={connected ? "status-connected" : "status-disconnected"}>
          {connected ? "Connected to core" : "Disconnected from core"}
        </span>
      </header>

      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {!connected && (
          <div className="disconnected-banner">
            Cannot connect to stellaryard-core. Make sure it is running.
          </div>
        )}
        {activeTab === "containers" && <ContainersPage />}
        {activeTab === "accounts" && <AccountsPage />}
        {activeTab === "ledger" && <LedgerPage />}
        {activeTab === "contracts" && <ContractsPage />}
      </main>
    </div>
  );
}
