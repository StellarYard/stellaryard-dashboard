// These types mirror stellaryard-core's API contract.
// In production, these should be GENERATED from core's /api/openapi.yaml
// to prevent drift. Do not hand-maintain — regenerate when core's spec changes.
//
// See ARCHITECTURE.md for why generated types matter.

export interface Account {
  id: string;
  publicKey: string;
  label: string;
  network: "local" | "testnet";
  balance?: string;
  createdAt: string;
}

export interface CreateAccountRequest {
  label: string;
  network: "local" | "testnet";
}

export interface ContainerStatus {
  name: "horizon" | "soroban-rpc";
  state: "running" | "stopped" | "error";
  health: "healthy" | "unhealthy" | "starting";
  started: string;
}

export interface ContractDeployment {
  id: string;
  wasmHash: string;
  contractId: string;
  deployedBy: string;
  network: string;
  createdAt: string;
}

export interface DeployContractRequest {
  /** Path on the core host (CLI). Provide exactly one of wasmPath or wasmBase64. */
  wasmPath?: string;
  /** Base64-encoded WASM binary (dashboard file upload). */
  wasmBase64?: string;
  /** Deployer account public key; defaults to the most recent managed account. */
  deployedBy?: string;
}

export interface InvokeContractRequest {
  method: string;
  args: string[];
  /** Signing account public key; defaults to the most recent managed account. */
  sourceAccount?: string;
}

export interface InvokeResult {
  txHash: string;
  status: string;
  resultXdr?: string;
}

export interface LedgerSnapshot {
  sequence: number;
  timestamp: string;
  txCount: number;
}

export interface Transaction {
  hash: string;
  sequence: number;
  source: string;
  fee: number;
  success: boolean;
  createdAt: string;
}
