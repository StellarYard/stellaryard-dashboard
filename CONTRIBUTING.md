# Contributing to StellarYard Dashboard

Thank you for your interest in contributing to StellarYard Dashboard! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, constructive, and professional. We're building tools for the Stellar ecosystem together.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- stellaryard-core running locally (for API calls)

### Setup

```bash
# Clone the repo
git clone https://github.com/StellarYard/stellaryard-dashboard.git
cd stellaryard-dashboard

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## How to Contribute

### Finding Issues

1. Check the [open issues](https://github.com/StellarYard/stellaryard-dashboard/issues) for tasks labeled `ready`
2. Issues labeled `good-first-issue` are ideal for first-time contributors
3. Read the issue description carefully — each issue includes acceptance criteria and implementation guidelines

### Submitting Changes

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes** following the coding standards below
4. **Write or update tests** for your changes
5. **Update ROADMAP.md** as part of your PR — this is required
6. **Commit** with a descriptive message:
   ```bash
   git commit -m "feat: add container status list page"
   ```
7. **Push** your branch:
   ```bash
   git push origin feat/your-feature-name
   ```
8. **Open a Pull Request** against `main`

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring without behavior change
- `style`: CSS/style changes
- `chore`: Maintenance tasks

Examples:
```
feat(pages): add container status list page
fix(hook): handle WebSocket reconnection on network change
test(components): add StatusBadge unit tests
style(pages): improve responsive layout for containers page
```

### Pull Request Guidelines

- **One logical change per PR** — don't bundle unrelated changes
- **Include tests** — PRs without test coverage will be sent back
- **Update ROADMAP.md** — every PR must update the roadmap to reflect what was done
- **Keep PRs small** — ideally under 500 lines of diff
- **Describe what and why** — not just what changed, but why

## Coding Standards

### TypeScript Style

- **Strict TypeScript** — `strict: true` in tsconfig, no `any` types
- Use TypeScript interfaces for all props and state
- Prefer `interface` over `type` for object shapes
- Use `readonly` for props that shouldn't mutate
- Component names: PascalCase, one component per file

### React Patterns

- Functional components only — no class components
- Use hooks for state and side effects
- React Query for server state management
- CSS Modules for component styling
- No inline styles — use CSS classes

### Project Structure

```
src/
  main.tsx              — Entry point with QueryClient
  App.tsx               — Tab routing and layout
  api/client.ts         — Typed fetch wrapper
  hooks/                — Custom React hooks
  pages/                — Page components (one folder per page)
  components/           — Shared UI components
  types/                — TypeScript type definitions
```

### Architecture Rules (Non-Negotiable)

1. **All types are generated from core's openapi.yaml** — never hand-write API types
2. **Core's OpenAPI spec is the single source of truth** — never fake backend behavior
3. **Must render explicit "disconnected from core" state** — never show stale data
4. **No cross-repo modifications** — note dependencies in PR descriptions
5. **ROADMAP.md must be updated in every PR**

### Testing

- Unit tests for components and hooks
- Use React Testing Library for component tests
- Mock API calls with MSW or jest mocks
- Test user interactions, not implementation details

## Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Include screenshots for visual bugs
- Include browser and OS information

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
