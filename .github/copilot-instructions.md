# Obsidian Kanban Bases View Plugin - Copilot Instructions

## Repository Overview

This is an **Obsidian plugin**.

**Key Technologies:**
- TypeScript (strict mode enabled)
- React 19.2.0 with JSX
- Vite for building
- Vitest for testing

## Build, Test, and Lint Commands

### Package Manager
**CRITICAL: Always use `pnpm` for package management, not npm.** The project uses pnpm workspaces and npm will timeout.

### Installation
```bash
pnpm install --frozen-lockfile
```

### Development
```bash
# Using mise (preferred for local development)
mise run dev

# Manual build with watch mode
pnpm vite build --watch
```

### Building
```bash
# Production build
pnpm vite build --mode production

# Development build
pnpm vite build
```

### Type Checking
```bash
tsc -noEmit
```

### Testing
```bash
# Run all tests
vitest run

# Run tests in watch mode
vitest watch

# Run tests with coverage
vitest run --coverage

# Run specific test file
vitest run src/__tests__/KanbanBoard.test.tsx
```

### Linting
```bash
# Check for linting errors
eslint src --ext .ts,.tsx

# Auto-fix linting errors (if possible)
eslint src --ext .ts,.tsx --fix
```

### Full Check Suite
```bash
# Run all checks (typecheck, lint, test)
mise run check
```