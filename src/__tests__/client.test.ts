import { describe, it, mock } from "node:test";
import assert from "node:assert";

const mockFetch = mock.fn();
global.fetch = mockFetch;

const { listContainers, listAccounts, checkConnection } = await import(
  "../api/client.ts"
);

describe("API Client", () => {
  it("listContainers calls correct endpoint", async () => {
    mockFetch.mock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    await listContainers();

    assert.strictEqual(mockFetch.mock.callCount(), 1);
    const [url, options] = mockFetch.mock.calls[0].arguments;
    assert.ok(url.includes("/api/v1/containers"));
    assert.strictEqual(options.method, undefined);
  });

  it("listAccounts calls correct endpoint", async () => {
    mockFetch.mock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    await listAccounts();

    assert.ok(mockFetch.mock.calls[1].arguments[0].includes("/api/v1/accounts"));
  });

  it("checkConnection returns true when API responds", async () => {
    mockFetch.mock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    const result = await checkConnection();
    assert.strictEqual(result, true);
  });

  it("checkConnection returns false when API fails", async () => {
    mockFetch.mock.mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    const result = await checkConnection();
    assert.strictEqual(result, false);
  });
});
