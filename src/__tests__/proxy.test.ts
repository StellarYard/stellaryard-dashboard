import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

describe("Dashboard WebSocket Authentication & Proxy Security", () => {
  const rootDir = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");

  test("vite.config.ts configures proxy for WebSockets and server-side API key injection", () => {
    const viteConfig = fs.readFileSync(path.join(rootDir, "vite.config.ts"), "utf-8");
    assert.match(viteConfig, /ws:\s*true/, "Vite proxy must enable WebSocket support (ws: true)");
    assert.match(viteConfig, /proxyReqWs/, "Vite proxy must handle WebSocket upgrade requests (proxyReqWs)");
    assert.match(viteConfig, /Authorization/, "Vite proxy must inject Authorization header when API key is set");
    assert.match(viteConfig, /STELLARYARD_API_KEY/, "Vite proxy must read STELLARYARD_API_KEY from environment");
  });

  test("nginx.conf deployment template secures WebSockets with header injection", () => {
    const nginxConf = fs.readFileSync(path.join(rootDir, "deploy/nginx.conf"), "utf-8");
    assert.match(nginxConf, /proxy_set_header\s+Upgrade\s+\$http_upgrade;/, "Nginx config must support Upgrade header");
    assert.match(nginxConf, /proxy_set_header\s+Connection\s+"upgrade";/, "Nginx config must set Connection upgrade");
    assert.match(nginxConf, /proxy_set_header\s+Authorization/, "Nginx config must inject Authorization header");
  });

  test("Caddyfile deployment template secures WebSockets with header injection", () => {
    const caddyfile = fs.readFileSync(path.join(rootDir, "deploy/Caddyfile"), "utf-8");
    assert.match(caddyfile, /reverse_proxy\s+http:\/\/stellaryard-core:8080/, "Caddyfile must reverse proxy to core");
    assert.match(caddyfile, /header_up\s+Authorization/, "Caddyfile must inject Authorization header");
  });

  test("Client-side code does not expose or store API secrets", () => {
    const apiCode = fs.readFileSync(path.join(rootDir, "src/api/client.ts"), "utf-8");
    const logViewerCode = fs.readFileSync(path.join(rootDir, "src/components/LogViewer.tsx"), "utf-8");

    assert.doesNotMatch(apiCode, /localStorage/, "API client must not store secrets in localStorage");
    assert.doesNotMatch(logViewerCode, /localStorage/, "LogViewer must not store secrets in localStorage");
    assert.doesNotMatch(logViewerCode, /\?token=|\?api_key=/, "WebSocket URL must not use query parameter authentication");
  });
});
