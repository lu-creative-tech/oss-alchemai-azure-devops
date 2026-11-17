# Contracts

> **Status:** package exists (`packages/contracts`) with `CONTRACT_VERSION`; feature request and response types are added with each feature.

`@alchemai/contracts` is the single source of truth for what the extension sends to the backend and what it gets back. Both sides import the same TypeScript types, so a mismatch is a compile error, not a production bug.

## Rules

- **Typed:** every request and response is a TypeScript type exported from `contracts`.
- **Versioned:** endpoints live under a version path (`/api/v1/...`) and the package exports `CONTRACT_VERSION`. A breaking change needs a new version and a **major** release of both extension and backend.
- **Validated:** the backend validates every incoming request against the contract (size, type, format) and the extension validates responses before showing them.
- **Dependency direction:** `backend` and `extension` may import `contracts`; `contracts` imports neither; `backend` and `extension` never import each other.

## How it is consumed

In the repository, TypeScript and ESLint resolve `@alchemai/contracts` straight from its source (`src/index.ts`) through the `@alchemai/source` export condition, so no build is needed to lint or test. At runtime, Node.js uses the compiled output in `dist/`.
