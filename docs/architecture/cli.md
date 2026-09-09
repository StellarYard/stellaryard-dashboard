# stellaryard-cli

A scriptable terminal client for StellarYard.

## Overview

The CLI talks to stellaryard-core's REST/WebSocket API and exposes it as composable terminal commands. Designed for automation with predictable exit codes and machine-parseable output.

## Key Components

| Component | Purpose |
|-----------|---------|
| `internal/cmd` | Cobra command definitions |
| `internal/client` | API client (generated from OpenAPI spec) |
| `internal/formatter` | Table and JSON output formatting |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Argument error |
| 2 | Core unreachable |
| 3 | Application error |

## Commands

```bash
stellaryard containers start --name horizon
stellaryard containers stop --name soroban-rpc
stellaryard containers status
stellaryard accounts create --label "test"
stellaryard accounts list --format json
stellaryard ledger snapshot
stellaryard contracts deploy ./contract.wasm
stellaryard logs horizon --follow
```

## See Also

- [API Reference](../api/overview.md)
- [Local Development Guide](../guides/local-development.md)
