# stellaryard-dashboard

The web UI for StellarYard.

## Overview

A React + TypeScript browser-based dashboard for visually managing your local Stellar development environment. Communicates with stellaryard-core's API — no business logic lives here.

## Key Components

| Component | Purpose |
|-----------|---------|
| `src/pages/containers` | Container status and controls |
| `src/pages/accounts` | Account list and creation |
| `src/pages/ledger` | Transaction browsing |
| `src/pages/contracts` | Contract deployment and invocation |
| `src/components` | Shared UI components |
| `src/api` | Typed API client |
| `src/hooks` | Custom React hooks |

## Tech Stack

- React 18 (function components + hooks)
- TypeScript (strict mode)
- Vite
- CSS Modules
- React Query

## Getting Started

```bash
npm install
npm run dev
```

Dashboard available at `http://localhost:5173`.

## See Also

- [API Reference](../api/overview.md)
- [Local Development Guide](../guides/local-development.md)
