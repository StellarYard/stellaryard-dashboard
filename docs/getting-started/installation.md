# Installation

## Prerequisites

Before installing StellarYard, ensure you have:

- **Docker** (20.10+) and **Docker Compose** (v2)
- **Go** (1.22+)
- **Node.js** (18+) — only if using the dashboard
- **Git**

### Verify Prerequisites

```bash
docker --version          # Docker version 20.10+
docker compose version    # Docker Compose v2+
go version                # go1.22+
node --version            # v18+ (dashboard only)
```

## Install stellaryard-core

```bash
git clone https://github.com/StellarYard/stellaryard-core.git
cd stellaryard-core
go mod tidy
```

## Install stellaryard-cli

```bash
git clone https://github.com/StellarYard/stellaryard-cli.git
cd stellaryard-cli
go mod tidy
go build -o stellaryard ./cmd/stellaryard

# Optional: move to PATH
sudo mv stellaryard /usr/local/bin/
```

## Install stellaryard-dashboard

```bash
git clone https://github.com/StellarYard/stellaryard-dashboard.git
cd stellaryard-dashboard
npm install
```

## Platform-Specific Notes

### macOS

Docker Desktop is required. Ensure the Docker daemon is running before starting core.

### Linux

Install Docker Engine and Docker Compose plugin:

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

### Windows

Use Docker Desktop for Windows. Run all commands in Git Bash or WSL2.

## Next Steps

- [Quick Start](quickstart.md) — Get running in 2 minutes
- [Configuration](configuration.md) — Customize your setup
