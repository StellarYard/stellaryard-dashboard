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

### API Communication

The dashboard communicates with stellaryard-core over HTTP/WS. Ensure the API URL points to a trusted local instance.

### WebSocket Connections

WebSocket connections to core should use appropriate reconnection logic. Sensitive data should not be logged or stored in browser storage.

### Client-Side Data

The dashboard holds no persistent state. All data comes from core. Do not add localStorage or sessionStorage for sensitive data.

### CORS

The dashboard relies on core's CORS configuration. If modifying CORS settings, ensure only trusted origins are allowed.

## Disclosure Policy

We follow responsible disclosure. We will:
- Credit reporters (unless they prefer anonymity)
- Not pursue legal action for good-faith security research
- Work with reporters on disclosure timing
