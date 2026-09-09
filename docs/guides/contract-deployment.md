# Contract Deployment Guide

How to deploy and invoke Soroban smart contracts using StellarYard.

## Prerequisites

- StellarYard core running
- A compiled Soroban WASM contract

## Deploying a Contract

### Using the CLI

```bash
# Deploy a contract
./stellaryard contracts deploy ./path/to/contract.wasm

# Output:
# Contract deployed successfully
# Contract ID: CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Using the Dashboard

1. Open the Contracts page
2. Click "Deploy Contract"
3. Select your `.wasm` file
4. Click "Deploy"
5. Copy the contract ID from the result

### Using the API

```bash
curl -X POST http://localhost:8080/api/v1/contracts/deploy \
  -F "wasm=@./path/to/contract.wasm"
```

## Invoking a Contract

### Using the CLI

```bash
# Invoke a contract method
./stellaryard contracts invoke CAXXXXXXXX initialize --arg "Hello, World!"

# Invoke with multiple args
./stellaryard contracts invoke CAXXXXXXXX transfer --arg "addr1" --arg "addr2" --arg "100"
```

### Using the API

```bash
curl -X POST http://localhost:8080/api/v1/contracts/CAXXXXXXXX/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "method": "initialize",
    "args": ["Hello, World!"]
  }'
```

## Contract Lifecycle

```
1. Write contract in Rust
   ↓
2. Compile to WASM: soroban contract build
   ↓
3. Deploy via StellarYard: contracts deploy ./contract.wasm
   ↓
4. Interact via CLI/Dashboard/API
   ↓
5. View results and logs
```

## Troubleshooting

### "WASM file not valid"

Ensure you compiled with Soroban CLI:
```bash
soroban contract build
```

### "Contract invocation failed"

- Check method name spelling
- Verify argument types match the contract
- Check contract logs: `./stellaryard logs soroban-rpc --follow`

### "Insufficient funds"

The deployer account needs XLM. Create a funded account first:
```bash
./stellaryard accounts create --label "deployer"
```
