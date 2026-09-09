import { describe, it } from "node:test";
import assert from "node:assert";
import type {
  Account,
  CreateAccountRequest,
  ContainerStatus,
  ContractDeployment,
  InvokeContractRequest,
  LedgerSnapshot,
  Transaction,
} from "../types";

describe("Type definitions", () => {
  it("Account type has required fields", () => {
    const account: Account = {
      id: "test-id",
      publicKey: "GBX...",
      label: "Test Account",
      network: "local",
      balance: "100.0",
      createdAt: "2024-01-01T00:00:00Z",
    };
    assert.strictEqual(account.id, "test-id");
    assert.strictEqual(account.network, "local");
  });

  it("ContainerStatus type has valid states", () => {
    const running: ContainerStatus = {
      name: "horizon",
      state: "running",
      health: "healthy",
      started: "2024-01-01T00:00:00Z",
    };
    const stopped: ContainerStatus = {
      name: "soroban-rpc",
      state: "stopped",
      health: "unhealthy",
      started: "2024-01-01T00:00:00Z",
    };
    assert.strictEqual(running.state, "running");
    assert.strictEqual(stopped.state, "stopped");
  });

  it("Transaction type has required fields", () => {
    const tx: Transaction = {
      hash: "abc123",
      sequence: 12345,
      source: "GBX...",
      fee: 100,
      success: true,
      createdAt: "2024-01-01T00:00:00Z",
    };
    assert.strictEqual(tx.success, true);
    assert.strictEqual(typeof tx.fee, "number");
  });
});
