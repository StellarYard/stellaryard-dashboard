# Ledger Endpoints

## Get Ledger Snapshot

```
GET /api/v1/ledger/snapshot
```

Returns the current ledger state summary.

**Response** `200 OK`

```json
{
  "sequence": 12345,
  "timestamp": "2026-01-15T10:30:00Z",
  "tx_count": 5
}
```

## List Transactions

```
GET /api/v1/ledger/transactions
```

Returns recent transactions (paginated).

**Query Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | int | 20 | Number of transactions to return |

**Response** `200 OK`

```json
[
  {
    "hash": "abc123...",
    "sequence": 12345,
    "source_account": "GABC...",
    "type": "payment",
    "successful": true,
    "created_at": "2026-01-15T10:30:00Z"
  }
]
```
