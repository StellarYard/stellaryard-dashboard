# Container Endpoints

## List Containers

```
GET /api/v1/containers
```

Returns the status of all managed containers.

**Response** `200 OK`

```json
[
  {
    "name": "horizon",
    "state": "running",
    "health": "healthy",
    "started_at": "2026-01-15T10:30:00Z"
  },
  {
    "name": "soroban-rpc",
    "state": "running",
    "health": "healthy",
    "started_at": "2026-01-15T10:30:00Z"
  }
]
```

## Start Container

```
POST /api/v1/containers/{name}/start
```

Starts a named container.

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Container name: `horizon` or `soroban-rpc` |

**Response** `200 OK`

```json
{
  "status": "started",
  "name": "horizon"
}
```

**Errors**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `CONTAINER_START_FAILED` | Container start failed |

## Stop Container

```
POST /api/v1/containers/{name}/stop
```

Stops a named container.

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Container name: `horizon` or `soroban-rpc` |

**Response** `200 OK`

```json
{
  "status": "stopped",
  "name": "horizon"
}
```

**Errors**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `CONTAINER_STOP_FAILED` | Container stop failed |

## Stream Logs (WebSocket)

```
WS /api/v1/containers/{name}/logs
```

Streams container logs in real-time.

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Container name: `horizon` or `soroban-rpc` |
