# API Reference

StellarYard Core exposes a REST/WebSocket API at `http://localhost:8080/api/v1`.

## Base URL

```
http://localhost:8080/api/v1
```

## Authentication

V1 has no authentication. The API is localhost-only.

!!! warning
    Do not expose the API to untrusted networks.

## Endpoints

### Containers

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/containers` | List all container statuses |
| `POST` | `/containers/{name}/start` | Start a container |
| `POST` | `/containers/{name}/stop` | Stop a container |
| `WS` | `/containers/{name}/logs` | Stream container logs |

### Accounts

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/accounts` | Create and fund a new account |
| `GET` | `/accounts` | List all managed accounts |
| `GET` | `/accounts/{publicKey}` | Get account details and balance |

### Contracts

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/contracts/deploy` | Deploy a WASM contract |
| `POST` | `/contracts/{contractId}/invoke` | Invoke a contract method |

### Ledger

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/ledger/snapshot` | Get current ledger state |
| `GET` | `/ledger/transactions` | List recent transactions |

## Error Responses

All errors return a consistent JSON shape:

```json
{
  "error": {
    "code": "CONTAINER_NOT_FOUND",
    "message": "Container 'horizon' not found",
    "details": {}
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `CONTAINER_NOT_FOUND` | 404 | Container name is invalid |
| `CONTAINER_ALREADY_RUNNING` | 409 | Container is already running |
| `DOCKER_UNAVAILABLE` | 503 | Docker daemon is not reachable |
| `ACCOUNT_NOT_FOUND` | 404 | Account with given public key not found |
| `FRIENDBOT_FAILED` | 502 | Friendbot funding failed |
| `CONTRACT_NOT_FOUND` | 404 | Contract ID not found |
| `INVOCATION_FAILED` | 400 | Contract invocation failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## OpenAPI Spec

Full request/response schemas: [`api/openapi.yaml`](https://github.com/StellarYard/stellaryard-core/blob/main/api/openapi.yaml)
