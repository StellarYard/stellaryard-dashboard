# Account Endpoints

## Create Account

```
POST /api/v1/accounts
```

Creates and funds a new test account using Friendbot.

**Request Body**

```json
{
  "label": "my-account"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | No | Human-readable label for the account |

**Response** `201 Created`

```json
{
  "id": "20260115103000.000000000",
  "public_key": "GABC...",
  "secret_key": "SABC...",
  "label": "my-account",
  "network": "local",
  "created_at": "2026-01-15T10:30:00Z"
}
```

!!! warning
    The `secret_key` is only for testnet/local use. Never use it on mainnet.

## List Accounts

```
GET /api/v1/accounts
```

Returns all managed accounts.

**Response** `200 OK`

```json
[
  {
    "id": "20260115103000.000000000",
    "public_key": "GABC...",
    "label": "my-account",
    "network": "local",
    "created_at": "2026-01-15T10:30:00Z"
  }
]
```

## Get Account

```
GET /api/v1/accounts/{publicKey}
```

Returns account details and balance.

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `publicKey` | string | Account public key (starts with G) |

**Response** `200 OK`

```json
{
  "id": "20260115103000.000000000",
  "public_key": "GABC...",
  "label": "my-account",
  "network": "local",
  "created_at": "2026-01-15T10:30:00Z"
}
```

**Errors**

| Status | Code | Description |
|--------|------|-------------|
| 404 | `ACCOUNT_NOT_FOUND` | Account not found |
