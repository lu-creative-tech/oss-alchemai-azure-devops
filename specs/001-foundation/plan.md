# Implementation Plan: Foundation

**Branch**: `feature/3-foundation` | **Date**: 2026-11-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-foundation/spec.md` (GitHub issue #3)

## Summary

Set up an npm workspaces monorepo with three packages (`contracts`, `backend`, `extension`) sharing a
strict TypeScript base config, one ESLint flat config and one Vitest run, and add GitHub Actions CI
that reports typecheck, lint, test, secret scan, dependency review and CodeQL as separate checks, plus
Dependabot for npm and Actions. Packages contain placeholder modules and smoke tests only.

## Technical Context

**Language/Version**: TypeScript (latest stable, `strict`) on Node.js 24 active LTS; `engines >=22` (R1)

**Primary Dependencies** (all dev): `typescript`, `eslint`, `@eslint/js`, `typescript-eslint`,
`globals`, `vitest` (R4, R5, R7)

**Storage**: N/A

**Testing**: Vitest with root `test.projects` over `packages/*` (R7)

**Target Platform**: GitHub Actions `ubuntu-latest` for CI; Windows, macOS and Linux for contributors

**Project Type**: npm workspaces monorepo (future web extension + serverless backend + shared contracts)

**Performance Goals**: all CI checks complete within 10 minutes (SC-002)

**Constraints**: least-privilege workflow permissions, SHA-pinned actions, no repository secrets
required, permissive-licensed dependencies only

**Scale/Scope**: 3 packages, 2 workflows, 1 Dependabot config, root tooling config, doc updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
| --- | --- | --- |
| I. Review Before Apply | N/A | No AI output, no Azure DevOps writes |
| II. Keys and Data Server-Side | Pass | No keys or model calls; `.gitignore` already excludes `.env*` and `local.settings.json` |
| III. Admin Control | N/A | No settings introduced |
| IV. Agent-Agnostic Backend | Pass | `contracts` package created as the typed, versioned contract home (`CONTRACT_VERSION`); no agent SDK added |
| V. Type Safety and Simplicity | Pass | `strict` + extra flags; lint errors on `any` and `!`; no formatter or extra tooling beyond the issue (R6) |
| VI. Testing | Pass | Vitest wired; smoke test per package; CI blocks merge on failure; no real providers |
| VII. Security | Pass | CodeQL (SAST), dependency review + Dependabot (SCA), gitleaks + GitHub secret scanning |
| VIII. Dependencies and Licensing | Pass | All dev deps MIT/Apache-2.0/BSD; license allow-list enforced in CI (R10); each dep justified in PR |
| IX. Workflow and Versioning | Pass | Branch `feature/3-foundation` per CONTRIBUTING.md; Conventional Commits; `CHANGELOG.md` Unreleased entry |

Quality gates: gate 2 and 3 become enforceable after this feature; gate 6 met by README and
CONTRIBUTING updates (FR-013).

**Post-design re-check**: Pass. Design adds no runtime dependencies and no abstractions beyond the
three packages the issue names. The CI license allow-list follows Principle VIII and the OSS
Licensing Guidelines, extended with MIT-equivalent ISC and 0BSD (R10).

## Project Structure

### Documentation (this feature)

```text
specs/001-foundation/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   ├── scripts.md       # Root npm scripts contract
│   └── ci-checks.md     # Required status check names
└── tasks.md             # Phase 2 (/speckit-tasks, not created here)
```

### Source Code (repository root)

```text
package.json                 # private root, workspaces: ["packages/*"], scripts, devDependencies, engines
package-lock.json
.nvmrc                       # 24
tsconfig.base.json           # shared strict compiler options
tsconfig.json                # solution file: references to the three packages
eslint.config.js             # flat config, typescript-eslint strictTypeChecked
vitest.config.ts             # test.projects: ["packages/*"]

packages/
├── contracts/
│   ├── package.json         # @alchemai/contracts, exports ./dist/index.js + types
│   ├── tsconfig.json        # composite
│   ├── vitest.config.ts
│   └── src/
│       ├── index.ts         # export const CONTRACT_VERSION
│       └── index.test.ts
├── backend/
│   ├── package.json         # @alchemai/backend, depends on @alchemai/contracts
│   ├── tsconfig.json        # composite, references ../contracts
│   ├── vitest.config.ts
│   └── src/
│       ├── index.ts
│       └── index.test.ts
└── extension/
    ├── package.json         # @alchemai/extension, depends on @alchemai/contracts
    ├── tsconfig.json        # composite, references ../contracts
    ├── vitest.config.ts
    └── src/
        ├── index.ts
        └── index.test.ts

.github/
├── dependabot.yml           # npm + github-actions, weekly, grouped
└── workflows/
    ├── ci.yml               # typecheck, lint, test, secret-scan, dependency-review
    ├── codeql.yml           # javascript-typescript, security-extended, weekly
    └── wiki.yml             # publishes docs/wiki/ to the GitHub wiki on merge to main

docs/wiki/                   # wiki source pages (FR-014)

README.md                    # Getting started: install / typecheck / lint / test (+ carried Claude API wording change)
CONTRIBUTING.md              # development setup and scripts
CHANGELOG.md                 # Unreleased: foundation entry
```

**Structure Decision**: `packages/*` workspace layout (R2). Dependency direction is enforced by ESLint
`no-restricted-imports` per package; TypeScript project references mirror it (data-model.md).

## Implementation Notes

- `contracts` resolution for siblings: `exports` lists a `@alchemai/source` condition pointing at
  `src/index.ts` before the `dist/` entries, and `tsconfig.base.json` sets it in `customConditions`.
  TypeScript and type-aware ESLint resolve the source without a build, so CI's `lint` job needs no
  `dist/`; `tsc -b` still maps it to the referenced project's output, and Node uses `dist/` at runtime.
  Vitest uses an alias to `src/` in each package config. A type error therefore fails only `typecheck`
  (SC-003).
- `secret-scan` job: checkout with `fetch-depth: 0`, run the gitleaks container on the commit range
  of the PR (or the pushed commits on `main`).
- `dependency-review` job runs only on `pull_request`.
- Dependency licenses and maintenance status are listed in the PR description (Principle VIII).

## Complexity Tracking

No constitution violations to justify.
