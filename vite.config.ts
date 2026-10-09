import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.STELLARYARD_CORE_URL || "http://127.0.0.1:8080",
        changeOrigin: true,
        // /api/v1/containers/{name}/logs is a WebSocket upgrade
        ws: true,
        configure: (proxy) => {
          const apiKey = process.env.STELLARYARD_API_KEY;
          if (apiKey) {
            // Forward Bearer token from server-side environment for HTTP requests
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("Authorization", `Bearer ${apiKey}`);
            });
            // Forward Bearer token from server-side environment for WebSocket upgrade requests
            proxy.on("proxyReqWs", (proxyReq) => {
              proxyReq.setHeader("Authorization", `Bearer ${apiKey}`);
            });
          }
        },
      },
    },
  },
});
