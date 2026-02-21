# Project Context

## Purpose

**Flopflip** is a modern feature toggling (feature flag) library for React applications. It enables developers to:

- Toggle features on/off without redeploying applications
- Run A/B tests and multivariate experiments
- Manage feature releases in real-time
- Integrate with multiple feature flag providers (LaunchDarkly, Split.io, GraphQL, HTTP endpoints)
- Store flag state in Redux or via React Context/Broadcasting

The library provides React components, hooks, and higher-order components for conditional rendering based on feature flags, with support for both simple and complex flag management scenarios.

## Tech Stack

- **Language**: TypeScript 5.9.3 (strict mode)
- **Frontend Framework**: React 19.2.0
- **State Management**: Redux 5.0.1 with Redux Toolkit 2.9.0
- **Build Tool**: Turbo (monorepo orchestration) with tsup for package building
- **Package Manager**: pnpm 10.18.2 (enforced via preinstall hook)
- **Testing**: Vitest 3.2.4 with @testing-library/react and Cypress 13.6.4 for E2E
- **Code Quality**: Biome 2.2.5 (linting & formatting, replaces ESLint/Prettier)
- **Release Management**: Changesets for versioning and changelog management
- **Key Libraries**: Babel, Lodash, ts-deepmerge, mitt (event emitter)
- **Distribution Formats**: ESM, CommonJS, UMD via unpkg.com CDN

## Project Conventions

### Code Style

- **Formatter/Linter**: Biome 2.2.5 (strict enforcement)
- **Line Width**: 80 characters (configured in biome.json)
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Double quotes for strings
- **Semicolons**: Required
- **TypeScript**: Strict mode enabled, full type coverage expected
- **Naming Conventions**:
  - PascalCase: Components, classes, types, interfaces
  - camelCase: Functions, variables, hooks
  - UPPER_SNAKE_CASE: Constants
  - Leading underscore: Private/internal APIs
- **File Organization**:
  - `/src/` contains source code
  - `/dist/` contains compiled output (ESM, CJS, UMD)
  - Tests colocated: `*.spec.ts` or `*.test.ts` next to source files
- **Import Organization**: Group by external dependencies, then internal modules
- **Comments**: JSDoc for public APIs; inline comments for complex logic

### Architecture Patterns

- **Monorepo Structure**: pnpm workspaces with Turbo orchestration
  - `/packages/` - Core libraries and adapters
  - `/tooling/` - Shared tooling and configurations
- **Adapter Pattern**: All feature flag providers implement a common adapter interface with `configure()` and `reconfigure()` methods
- **Observer Pattern**: Adapters notify UI layer via callbacks (`onFlagsStateChange`, `onStatusStateChange`)
- **Separation of Concerns**:
  - Core logic in `@flopflip/react` (hooks, components)
  - State management bindings in `@flopflip/react-redux` and `@flopflip/react-broadcast`
  - Provider adapters in separate packages (`@flopflip/launchdarkly-adapter`, etc.)
  - Shared types in `@flopflip/types`
- **Composition**: Smaller, focused packages that can be used independently
- **Plugin System**: Cypress plugin at `@flopflip/cypress-plugin` for testing support

### Testing Strategy

- **Unit Tests**: Vitest with @testing-library/react for component testing
- **Test Coverage**: Expected to cover business logic and edge cases
- **Test Files**: Colocated with source code (`*.spec.ts` or `*.test.ts`)
- **Shared Config**: `vitest.shared.ts` for consistent test setup across packages
- **E2E Tests**: Cypress for integration testing with custom Flopflip plugin
- **Testing Utilities**: `@flopflip/test-utils` provides mock adapters and test helpers
- **Requirements**:
  - All public APIs must have test coverage
  - Breaking changes require test updates
  - Integration tests validate adapter behavior

### Git Workflow

- **Branching Strategy**: Feature branches off `main`, PR-based workflow
- **Main Branch**: `main` is the default and production-ready branch
- **Commit Conventions**: Conventional Commits (type: scope - description)
  - `feat:` new feature
  - `fix:` bug fix
  - `chore:` maintenance, dependencies
  - `docs:` documentation updates
  - `test:` test additions/changes
  - `refactor:` code refactoring
  - `perf:` performance improvements
- **Release Process**:
  - Use `pnpm changeset` to create changeset entries
  - Changesets are reviewed and merged to `main`
  - Automated release workflow publishes to npm with version bumps
- **CI/CD**: GitHub Actions workflows for testing, building, and publishing

## Domain Context

**Feature Toggling Concepts**:

- **Feature Flags**: Boolean toggles for on/off control
- **Variants/Experiments**: Multi-variate flags (A/B tests, canary releases)
- **User Context**: Flags evaluated based on user properties (ID, segment, custom attributes)
- **Reconfiguration**: Ability to update user context (e.g., after routing) via `ReconfigureAdapter`
- **Provider Agnostic**: Designed to work with any feature flag service or custom backend

**Key Components & Hooks**:

- `ConfigureAdapter` - Set up feature flag provider
- `ToggleFeature` - Conditional rendering based on flags
- `useFeatureToggle()` - Read single flag value
- `useFeatureToggles()` - Read multiple flag values
- `useFlagVariation()` - Access multivariate flag values
- `branchOnFeatureToggle()` - Higher-order component for conditional rendering
- `injectFeatureToggle()` - HOC to inject flag into component props
- `ReconfigureAdapter` - Update user context without full reconfiguration

**Adapter Interface Contract**:
All adapters must implement:

- `configure(config, callbacks)` - Initialize with user context
- `reconfigure(config)` - Update user context
- Callbacks: `onFlagsStateChange`, `onStatusStateChange` for state updates

## Important Constraints

- **Node Version**: Node 20+ required
- **Package Manager**: pnpm 9+ enforced (preinstall hook prevents npm/yarn)
- **Browser Support**: Modern browsers (ES2020+ target)
- **TypeScript**: Strict mode mandatory
- **Code Quality**: Biome checks must pass in CI/CD
- **Testing**: Tests must pass before merge
- **Line Length**: 80-character limit (Biome enforced)
- **Dependency Management**: Use pnpm workspaces; no hoisting issues with dependencies
- **Breaking Changes**: Require major version bump and thorough documentation
- **Performance**: Libraries must support tree-shaking; avoid side effects in modules

## External Dependencies

- **Feature Flag Providers**:
  - LaunchDarkly (via @flopflip/launchdarkly-adapter)
  - Split.io (via @flopflip/splitio-adapter)
  - Custom GraphQL endpoints (via @flopflip/graphql-adapter)
  - Custom HTTP endpoints (via @flopflip/http-adapter)
- **Package Registry**: npm (published as scoped packages @flopflip/\*)
- **CDN**: unpkg.com (UMD builds available)
- **CI/CD**: GitHub Actions
- **Version Control**: Git/GitHub
