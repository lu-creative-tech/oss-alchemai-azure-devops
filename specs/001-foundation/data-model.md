# Data Model: Foundation

This feature has no runtime data. The "entities" are the workspace packages and the CI checks.

## Workspace package

| Field | Value rules |
| --- | --- |
| Directory | `packages/<name>` |
| Name | `@alchemai/<name>`; `private: true` |
| Module type | `"type": "module"` (ESM) |
| TypeScript project | `tsconfig.json` extending `../../tsconfig.base.json`, `composite: true` |
| Tests | `vitest.config.ts` plus at least one `*.test.ts` |

### Packages and allowed dependencies

| Package | Purpose (now) | May depend on |
| --- | --- | --- |
| `contracts` | Typed, versioned extension–backend contracts; exports `CONTRACT_VERSION` | nothing internal |
| `backend` | Future Azure Function App; placeholder module importing `contracts` | `contracts` |
| `extension` | Future Azure DevOps extension; placeholder module importing `contracts` | `contracts` |

```text
extension ──► contracts ◄── backend
(no edge between extension and backend)
```

Validation: the dependency rule is enforced by ESLint `no-restricted-imports` per package, because
npm workspaces link every package into the root `node_modules` and would otherwise let a cross import
resolve. TypeScript project `references` (only `contracts` is referenced) and each `package.json`
listing only `@alchemai/contracts` keep the build graph aligned with the rule.

## CI check

| Check name | Workflow | Trigger | Fails when |
| --- | --- | --- | --- |
| `typecheck` | `ci.yml` | PR, push `main` | `tsc -b` reports an error |
| `lint` | `ci.yml` | PR, push `main` | any ESLint error or warning |
| `test` | `ci.yml` | PR, push `main` | any Vitest failure |
| `secret-scan` | `ci.yml` | PR, push `main` | gitleaks finds a secret |
| `dependency-review` | `ci.yml` | PR | vulnerable dependency (moderate+) or disallowed license |
| `CodeQL` (`analyze`) | `codeql.yml` | PR, push `main`, weekly | CodeQL alert per repo alert settings |

See [contracts/ci-checks.md](./contracts/ci-checks.md) for the stable names branch protection relies on.
