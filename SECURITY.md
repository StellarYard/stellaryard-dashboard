# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in StellarYard Dashboard, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email: **security@stellaryard.dev**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 1 week
- **Fix or mitigation**: Depends on severity, typically within 2 weeks

## Scope

This security policy applies to:
- The React/TypeScript dashboard application
- WebSocket connections to core
- API client communication
- Client-side data handling

## Out of Scope

- stellaryard-core vulnerabilities — report to the core repo
- Browser security issues — report to browser vendors

## Key Security Considerations

### API Communication & Trusted Proxy Boundary

The dashboard communicates with stellaryard-core over HTTP/WS. In development, Vite's dev server acts as a same-origin reverse proxy (`http://localhost:3000/api` -> `http://127.0.0.1:8080/api`). In production, a reverse proxy (e.g. Nginx or Caddy) must sit in front of the application to serve static assets and proxy API requests.

### WebSocket Authentication & Security

Browser-native `WebSocket` APIs cannot set arbitrary HTTP headers (such as `Authorization: Bearer <token>`). To maintain strict security without compromising credentials:
- **No Query-String Tokens:** Secrets or API keys are **never** passed in WebSocket URLs or query strings (`?token=...`), preventing token leakage in browser history, proxy access logs, and HTTP referrers.
- **Trusted Boundary Injection:** When connecting to a protected or non-loopback `stellaryard-core` instance requiring an API key, the same-origin reverse proxy or Backend-For-Frontend (BFF) securely injects the `Authorization: Bearer <key>` header on upstream HTTP requests and WebSocket upgrades.
- **Client Bundle Isolation:** API keys and credentials are never stored in client bundles, `localStorage`, `sessionStorage`, or cookies accessible to client scripts.

### Client-Side Data

The dashboard holds no persistent state. All data comes from core. Do not add localStorage or sessionStorage for sensitive data.

### CORS & Origin Validation

Core strictly enforces Origin validation. When connecting via WebSocket, only approved development origins (`localhost:3000`, `127.0.0.1:3000`) or explicitly configured `STELLARYARD_ALLOWED_ORIGINS` are accepted.

## Disclosure Policy

We follow responsible disclosure. We will:
- Credit reporters (unless they prefer anonymity)
- Not pursue legal action for good-faith security research
- Work with reporters on disclosure timing
