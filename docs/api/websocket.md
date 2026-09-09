# WebSocket Endpoints

## Stream Container Logs

```
WS /api/v1/containers/{name}/logs
```

Streams container logs in real-time over WebSocket.

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Container name: `horizon` or `soroban-rpc` |

**Connection**

```javascript
const ws = new WebSocket('ws://localhost:8080/api/v1/containers/horizon/logs');

ws.onmessage = (event) => {
  console.log('Log:', event.data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};
```

**Message Format**

Logs are streamed as plain text lines. Each message contains one log line.

**Reconnection**

The client should implement reconnection logic with exponential backoff:

1. On connection close, wait 1 second
2. On second failure, wait 2 seconds
3. On third failure, wait 4 seconds
4. Continue doubling up to 30 seconds
5. Reset backoff on successful connection

**Example (with reconnection)**

```javascript
function connectWithReconnect(url, onMessage) {
  let retryDelay = 1000;

  function connect() {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      retryDelay = 1000; // Reset on success
    };

    ws.onmessage = (event) => {
      onMessage(event.data);
    };

    ws.onclose = () => {
      setTimeout(() => {
        retryDelay = Math.min(retryDelay * 2, 30000);
        connect();
      }, retryDelay);
    };
  }

  connect();
}
```
