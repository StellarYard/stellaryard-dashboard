# Contract Endpoints

## Deploy Contract

```
POST /api/v1/contracts/deploy
```

Deploys a Soroban WASM contract to the local network.

**Request**

Multipart form with WASM file:

```
Content-Type: multipart/form-data

wasm: <binary WASM file>
```

**Response** `200 OK`

```json
{
  "contract_id": "CAXXXXXXXXXXXX...",
  "wasm_hash": "abc123...",
  "deployed_by": "GABC..."
}
```

**Errors**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `INVALID_WASM` | Invalid WASM file |
| 500 | `DEPLOY_FAILED` | Deployment failed |

## Invoke Contract

```
POST /api/v1/contracts/{contractId}/invoke
```

Invokes a method on a deployed contract.

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `contractId` | string | Contract ID (starts with C) |

**Request Body**

```json
{
  "method": "initialize",
  "args": ["Hello, World!"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `method` | string | Yes | Method name to invoke |
| `args` | array | No | Method arguments |

**Response** `200 OK`

```json
{
  "result": "...",
  "logs": []
}
```

**Errors**

| Status | Code | Description |
|--------|------|-------------|
| 404 | `CONTRACT_NOT_FOUND` | Contract ID not found |
| 400 | `INVOCATION_FAILED` | Contract invocation failed |
