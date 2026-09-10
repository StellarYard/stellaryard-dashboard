// API client for stellaryard-core.
// TODO: Generate this from core's /api/openapi.yaml in production.
// For now, hand-written typed fetch calls for V1 scaffolding.

import type {
  Account,
  CreateAccountRequest,
  ContainerStatus,
  ContractDeployment,
  InvokeContractRequest,
  InvokeResult,
  LedgerSnapshot,
  Transaction,
} from "../types";

const BASE_URL = "/api/v1";

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// --- Containers ---

export async function listContainers(): Promise<ContainerStatus[]> {
  return fetchJSON<ContainerStatus[]>("/containers");
}

export async function startContainer(name: string): Promise<void> {
  await fetchJSON(`/containers/${name}/start`, { method: "POST" });
}

export async function stopContainer(name: string): Promise<void> {
  await fetchJSON(`/containers/${name}/stop`, { method: "POST" });
}

export async function restartContainer(name: string): Promise<void> {
  await stopContainer(name);
  await startContainer(name);
}

// --- Accounts ---

export async function listAccounts(): Promise<Account[]> {
  return fetchJSON<Account[]>("/accounts");
}

export async function getAccount(publicKey: string): Promise<Account> {
  return fetchJSON<Account>(`/accounts/${publicKey}`);
}

export async function createAccount(
  req: CreateAccountRequest
): Promise<Account> {
  return fetchJSON<Account>("/accounts", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

// --- Contracts ---

export async function deployContract(
  wasmPath: string
): Promise<ContractDeployment> {
  return fetchJSON<ContractDeployment>("/contracts/deploy", {
    method: "POST",
    body: JSON.stringify({ wasmPath }),
  });
}

export async function deployContractFile(
  file: File,
  deployedBy?: string
): Promise<ContractDeployment> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  return fetchJSON<ContractDeployment>("/contracts/deploy", {
    method: "POST",
    body: JSON.stringify({ wasmBase64: bytesToBase64(bytes), deployedBy }),
  });
}

export async function listDeployments(): Promise<ContractDeployment[]> {
  return fetchJSON<ContractDeployment[]>("/contracts/deployments");
}

export async function invokeContract(
  contractId: string,
  req: InvokeContractRequest
): Promise<InvokeResult> {
  return fetchJSON<InvokeResult>(`/contracts/${contractId}/invoke`, {
    method: "POST",
    body: JSON.stringify(req),
  });
}

// bytesToBase64 encodes bytes as base64 in chunks so large WASM files don't
// blow the call stack (String.fromCharCode(...) with huge spread args).
function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

// --- Ledger ---

export async function getLedgerSnapshot(): Promise<LedgerSnapshot> {
  return fetchJSON<LedgerSnapshot>("/ledger/snapshot");
}

export async function listTransactions(
  limit = 20,
  offset = 0
): Promise<Transaction[]> {
  return fetchJSON<Transaction[]>(
    `/ledger/transactions?limit=${limit}&offset=${offset}`
  );
}

// --- Connection check ---

export async function checkConnection(): Promise<boolean> {
  try {
    await fetchJSON("/containers");
    return true;
  } catch {
    return false;
  }
}
