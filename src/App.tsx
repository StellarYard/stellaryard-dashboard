import { useEffect, useState } from "react";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { ContainersPage } from "./pages/containers/ContainersPage";
import { AccountsPage } from "./pages/accounts/AccountsPage";
import { LedgerPage } from "./pages/ledger/LedgerPage";
import { ContractsPage } from "./pages/contracts/ContractsPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

type Tab = "containers" | "accounts" | "ledger" | "contracts";

const tabs: { id: Tab; label: string }[] = [
  { id: "containers", label: "Containers" },
  { id: "accounts", label: "Accounts" },
  { id: "ledger", label: "Ledger" },
  { id: "contracts", label: "Contracts" },
];

// tabFromPath maps a URL pathname to a tab, defaulting to "containers" for
// unknown paths so deep links never render a blank page.
function tabFromPath(pathname: string): Tab {
  const segment = pathname.replace(/^\/+|\/+$/g, "").split("/")[0];
  return tabs.some((t) => t.id === segment) ? (segment as Tab) : "containers";
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(() =>
    tabFromPath(window.location.pathname)
  );
  const connected = useConnectionStatus();

  // On first mount, normalize the URL (e.g. "/" -> "/containers") without
  // adding a history entry. Runs before the pushState effect below.
  useEffect(() => {
    const path = `/${activeTab}`;
    if (window.location.pathname !== path) {
      window.history.replaceState({ tab: activeTab }, "", path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync tab state -> URL so refresh restores the active tab.
  useEffect(() => {
    const path = `/${activeTab}`;
    if (window.location.pathname !== path) {
      window.history.pushState({ tab: activeTab }, "", path);
    }
  }, [activeTab]);

  // Sync URL -> tab state on browser back/forward.
  useEffect(() => {
    const onPopState = () => setActiveTab(tabFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
        {/* Each page gets its own boundary so a crash on one page does not
            take down the others (AGENTS.md known pitfalls). */}
        <ErrorBoundary key={activeTab}>
          {activeTab === "containers" && <ContainersPage />}
          {activeTab === "accounts" && <AccountsPage />}
          {activeTab === "ledger" && <LedgerPage />}
          {activeTab === "contracts" && <ContractsPage />}
        </ErrorBoundary>
      </main>
    </div>
  );
}
