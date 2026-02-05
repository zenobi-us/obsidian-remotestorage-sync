# AGENTS.md - Obsidian Remote Storage Sync Plugin

Guidelines for agentic coding operations in this repository.

## Build, Test, and Lint Commands

**Package Manager: Use `pnpm` ONLY** (npm will timeout with workspaces)

### Development
```bash
mise run dev          # Start Vite dev server with hot reload + symlink to vault
mise run setup        # Install dependencies with pnpm (cached with bkt)
mise run setup-vault  # Configure Obsidian vault path
mise run symlink      # Symlink plugin to vault
```

### Testing
```bash
vitest run            # Run all tests once
vitest run <file>     # Run specific test file (e.g., src/__tests__/utils.test.ts)
vitest watch          # Run tests in watch mode during development
vitest run --coverage # Generate coverage reports (80% threshold for all metrics)
```

### Build & Check
```bash
mise run build        # Type check + Vite build (TypeScript + bundle)
mise run check        # Full suite: typecheck + lint + vitest run
tsc -noEmit           # Type check only (strict mode enabled)
```

## Code Style Guidelines

### TypeScript & Strict Mode
- **Strict mode enabled**: `noImplicitAny`, `exactOptionalPropertyTypes`, full type safety required
- No `any` types - use proper types or generics
- Prefer `const` over `let`, never use `var`
- Always explicit return types on functions

### Imports & Module Resolution
- Use named imports: `import { Plugin } from 'obsidian'` (not default imports)
- Path alias available: `@/` maps to `src/`
- Mock alias: `obsidian` imports use `src/__tests__/mocks/obsidian.mock.ts` in tests
- External modules (obsidian, electron, codemirror) are pre-bundled - don't worry about bundle size

### React & JSX
- React 19.2.0, JSX auto-transform enabled (`jsx: "react-jsx"`)
- Functional components with hooks only
- Props should be typed with interfaces/types
- Use `@vitejs/plugin-react` - HMR enabled in dev mode

### Naming Conventions
- Files: kebab-case for component/utility files, PascalCase for React components
- Classes: PascalCase (e.g., `MyPlugin extends Plugin`)
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE for true constants
- Tests: `*.test.ts` or `*.test.tsx` pattern

### Error Handling
- No silent failures - always handle errors explicitly
- Use try/catch for async operations
- Prefer typed error objects over strings
- Log errors to Obsidian console for debugging: `console.error()`

### Testing Strategy
- **Test environment**: happy-dom (lightweight DOM) configured in vitest.config.mjs
- **Setup file**: `src/__tests__/setup.ts` - use for global test utilities
- **Coverage threshold**: 80% (lines, functions, branches, statements)
- Exclude from coverage: `*.d.ts`, `main.ts`, `views/**`, `__tests__/**`
- Mock obsidian API via provided mock file

### Formatting & Linting
- ESLint configured in `.eslintrc*` (if exists)
- No Prettier config - use ESLint defaults or project conventions
- 2-space indentation (inferred from tsconfig + Vite config)

## Key Project Context

- **Obsidian Plugin**: Built on Obsidian's Plugin API (v1.10.3+)
- **Build output**: Single `main.js` + `manifest.json` + `styles.css`
- **Hot reload**: `.hotreload` file triggers Obsidian refresh in dev mode
- **Vault integration**: Plugin symlinked to `.obsidian/plugins/{pluginId}` during dev
- **Entry point**: `src/main.ts` - exports Plugin class

## See Also

- `.github/copilot-instructions.md` - Extended guidance for this project
- `manifest.json` - Plugin ID, version, metadata
- `vitest.config.mjs` - Test environment setup
- `vite.config.mjs` - Build configuration with hot reload
