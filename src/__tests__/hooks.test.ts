import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Hooks", () => {
  it("useConnectionStatus file exists and exports function", () => {
    const filePath = resolve(import.meta.dirname, "../hooks/useConnectionStatus.ts");
    const content = readFileSync(filePath, "utf-8");
    assert.ok(content.includes("export function useConnectionStatus"));
  });
});
