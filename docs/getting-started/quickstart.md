# Quick Start

Get StellarYard running in 2 minutes.

## Step 1: Start Core

```bash
cd stellaryard-core

# Start Horizon and Soroban RPC containers
docker compose up -d

# Start the core API server
go run cmd/server/main.go
```

Core is now running at `http://localhost:8080`.

## Step 2: Verify It Works

```bash
# Check container status
curl http://localhost:8080/api/v1/containers | jq .
```

You should see both Horizon and Soroban RPC containers listed.

## Step 3: Use the CLI

```bash
cd ../stellaryard-cli

# Build and run
go build -o stellaryard ./cmd/stellaryard

# Check container status
./stellaryard containers status

# Create a test account
./stellaryard accounts create --label "my-account"
```

## Step 4: Or Use the Dashboard

```bash
cd ../stellaryard-dashboard

# Install and start
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## What Just Happened?

1. **Docker** started Horizon (Stellar's API server) and Soroban RPC (smart contract server)
2. **Core** connected to Docker and began managing the containers
3. **CLI/Dashboard** connected to core's API to control and monitor everything

## Common First Commands

```bash
# Start containers
./stellaryard containers start --name horizon
./stellaryard containers start --name soroban-rpc

# Create and fund an account
./stellaryard accounts create --label "dev-account"

# Check ledger state
./stellaryard ledger snapshot

# Stream logs
./stellaryard logs horizon --follow
```

## Stopping Everything

```bash
# Stop the CLI/dashboard (Ctrl+C)

# Stop core (Ctrl+C in its terminal)

# Stop containers
docker compose down
```

## Next Steps

- [Configuration](configuration.md) — Customize ports, networks, and behavior
- [Architecture](../architecture/overview.md) — Understand how the components fit together
- [Contract Deployment](../guides/contract-deployment.md) — Deploy your first Soroban contract
