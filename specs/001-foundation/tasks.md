---

description: "Task list for the Foundation feature (issue #3)"
---

# Tasks: Foundation

**Input**: Design documents from `specs/001-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No TDD requested. Each package ships one smoke test (spec edge case) so the test run is
never vacuously green; the CI checks themselves are validated through quickstart.md.

**Organization**: Tasks are grouped by user story. US2 and US3 both edit `.github/workflows/ci.yml`,
so their `ci.yml` tasks run sequentially.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1, US2, US3 from spec.md
- Paths are relative to the repository root

## Conventions for every task

- Dependency versions: the latest stable release that is at least two weeks old.
- Third-party GitHub Actions: pin to a full commit SHA with a `# vX.Y.Z` trailing comment (R13).
- Comments in code and config only for a non-obvious why, one short line (Constitution V).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Root workspace and toolchain

- [X] T001 Create root `package.json`: `"name": "alchemai"`, `"private": true`, `"type": "module"`, `"workspaces": ["packages/*"]`, `"engines": { "node": ">=22" }`, and scripts exactly as in `specs/001-foundation/contracts/scripts.md` (`typecheck`: `tsc -b`, `lint`: `eslint . --max-warnings 0`, `test`: `vitest run`, `test:watch`: `vitest`)
- [X] T002 [P] Create `.nvmrc` containing `24`
- [X] T003 Install dev dependencies at the root with `npm install -D typescript eslint @eslint/js typescript-eslint globals vitest`, producing `package-lock.json`; note each package's license and version for the PR description (Constitution VIII)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared TypeScript config and the three package skeletons. CI (US2) and CodeQL (US3) need real code to check.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create `tsconfig.base.json` with `compilerOptions`: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`, `isolatedModules`, `forceConsistentCasingInFileNames`, `skipLibCheck` all `true`; `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`, `"target": "ES2023"`, `"lib": ["ES2023"]`, `"declaration": true`, `"declarationMap": true`, `"sourceMap": true`, `"customConditions": ["@alchemai/source"]` (so TypeScript and type-aware ESLint resolve `@alchemai/contracts` to its source without a build; R4)
- [X] T005 [P] Create `packages/contracts/package.json` (`"name": "@alchemai/contracts"`, `"private": true`, `"type": "module"`, `"version": "0.1.0"`, `"exports": { ".": { "@alchemai/source": "./src/index.ts", "types": "./dist/index.d.ts", "import": "./dist/index.js" } }`, with the custom condition listed first), `packages/contracts/tsconfig.json` (extends `../../tsconfig.base.json`, `"composite": true`, `"rootDir": "src"`, `"outDir": "dist"`, `"include": ["src"]`) and `packages/contracts/src/index.ts` exporting `export const CONTRACT_VERSION = "0.1.0";`
- [X] T006 [P] Create `packages/backend/package.json` (`"name": "@alchemai/backend"`, `"private": true`, `"type": "module"`, `"version": "0.1.0"`, `"dependencies": { "@alchemai/contracts": "0.1.0" }`), `packages/backend/tsconfig.json` (same options as contracts plus `"references": [{ "path": "../contracts" }]`) and `packages/backend/src/index.ts` exporting `SUPPORTED_CONTRACT_VERSION` set from `CONTRACT_VERSION` imported from `@alchemai/contracts`
- [X] T007 [P] Create `packages/extension/package.json` (`"name": "@alchemai/extension"`, otherwise as backend), `packages/extension/tsconfig.json` (references only `../contracts`) and `packages/extension/src/index.ts` exporting `SUPPORTED_CONTRACT_VERSION` from `CONTRACT_VERSION` of `@alchemai/contracts`
- [X] T008 Create root `tsconfig.json` as a solution file: `"files": []`, `"references"` to `./packages/contracts`, `./packages/backend`, `./packages/extension`
- [X] T009 Run `npm install` to link the workspaces (updates `package-lock.json`), then `npm run typecheck`; it must pass and emit `packages/*/dist/`, which `.gitignore` already excludes

**Checkpoint**: `npm run typecheck` passes; `backend` and `extension` resolve `@alchemai/contracts`

---

## Phase 3: User Story 1 - Contributor builds and tests locally (Priority: P1) 🎯 MVP

**Goal**: One install and three root commands typecheck, lint and test every package.

**Independent Test**: quickstart.md sections 1 and 2 on a clean clone.

### Implementation for User Story 1

- [X] T010 [P] [US1] Create `eslint.config.js` (flat config, ESM): ignore `**/dist/**` and `**/coverage/**`; extend `@eslint/js` `recommended`, `typescript-eslint` `strictTypeChecked` and `stylisticTypeChecked`; `languageOptions.parserOptions.projectService` with `allowDefaultProject: ["*.js", "*.ts", "packages/*/vitest.config.ts"]` and `tsconfigRootDir: import.meta.dirname`; `globals.node`; set `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-non-null-assertion` to `"error"`; enforce FR-003 with `no-restricted-imports` `patterns` per package: files in `packages/backend/**` may not import `@alchemai/extension`, `@alchemai/extension/*` or relative paths into `packages/extension`; files in `packages/extension/**` the same for `backend`; files in `packages/contracts/**` may import neither; disable type-checked rules for `*.js` files with `tseslint.configs.disableTypeChecked`
- [X] T011 [P] [US1] Create root `vitest.config.ts` with `test.projects: ["packages/*"]`
- [X] T012 [P] [US1] Create `packages/contracts/vitest.config.ts` with `test.name: "contracts"`, `test.environment: "node"`, `test.include: ["src/**/*.test.ts"]`
- [X] T013 [P] [US1] Create `packages/backend/vitest.config.ts` with `test.name: "backend"`, `test.environment: "node"`, `test.include: ["src/**/*.test.ts"]`, and `resolve.alias` mapping `@alchemai/contracts` to `../contracts/src/index.ts` (via `fileURLToPath(new URL(..., import.meta.url))`) so `npm test` runs without a prior build
- [X] T014 [P] [US1] Create `packages/extension/vitest.config.ts` matching T013 with `test.name: "extension"`
- [X] T015 [P] [US1] Create smoke test `packages/contracts/src/index.test.ts` asserting `CONTRACT_VERSION` matches a semver pattern
- [X] T016 [P] [US1] Create smoke test `packages/backend/src/index.test.ts` asserting `SUPPORTED_CONTRACT_VERSION` equals `CONTRACT_VERSION`
- [X] T017 [P] [US1] Create smoke test `packages/extension/src/index.test.ts` asserting `SUPPORTED_CONTRACT_VERSION` equals `CONTRACT_VERSION`
- [X] T018 [US1] With no `packages/*/dist/` present, run `npm run lint` and `npm test`, then `npm run typecheck`, from the root; fix until all pass and Vitest lists the `contracts`, `backend` and `extension` projects
- [X] T019 [US1] Run each negative check in `specs/001-foundation/quickstart.md` section 2 (type error, `any`, non-null assertion, `backend` importing `@alchemai/extension` failing `lint` on `no-restricted-imports`, failing assertion); confirm each fails the expected script, then revert every change

**Checkpoint**: US1 complete; SC-001 met locally

---

## Phase 4: User Story 2 - Pull requests are checked automatically (Priority: P1)

**Goal**: typecheck, lint and test run as separate status checks on PRs and pushes to `main`.

**Independent Test**: quickstart.md section 4, steps 1 and 2.

### Implementation for User Story 2

- [X] T020 [US2] Create `.github/workflows/ci.yml` named `CI`: triggers `pull_request` (branches `main`) and `push` (branches `main`); top-level `permissions: contents: read`; `concurrency: { group: "${{ github.workflow }}-${{ github.ref }}", cancel-in-progress: "${{ github.event_name == 'pull_request' }}" }`
- [X] T021 [US2] In `.github/workflows/ci.yml` add jobs `typecheck`, `lint`, `test` (job ids and `name` exactly as in `specs/001-foundation/contracts/ci-checks.md`), each on `ubuntu-latest` with `timeout-minutes: 10`: `actions/checkout` (`persist-credentials: false`), `actions/setup-node` (`node-version-file: .nvmrc`, `cache: npm`), `npm ci`, then `npm run typecheck` / `npm run lint` / `npm test`
- [X] T022 [US2] Validate `.github/workflows/ci.yml` locally with `actionlint` if available (otherwise rely on the first PR run) and confirm no job references repository secrets

**Checkpoint**: US2 ready to verify on the PR

---

## Phase 5: User Story 3 - Code and dependencies are scanned (Priority: P2)

**Goal**: SAST, SCA with license policy, secret scanning and automated dependency updates.

**Independent Test**: quickstart.md section 4, steps 3 to 5.

### Implementation for User Story 3

- [X] T023 [P] [US3] Use CodeQL default setup (repository setting, already enabled) for `javascript-typescript`; do not add a CodeQL workflow, since GitHub rejects advanced-setup results while default setup is on (R9)
- [X] T024 [P] [US3] Create `.github/dependabot.yml` (`version: 2`) with ecosystem `npm` (directory `/`, weekly, group `npm-minor-patch` covering `update-types: ["minor", "patch"]`, majors ungrouped) and ecosystem `github-actions` (directory `/`, weekly, one group for all updates); use Conventional Commit prefixes via `commit-message: { prefix: "chore", include: "scope" }`
- [X] T025 [US3] In `.github/workflows/ci.yml` add job `dependency-review` (`if: github.event_name == 'pull_request'`, `timeout-minutes: 5`): `actions/checkout` then `actions/dependency-review-action` with `fail-on-severity: moderate` and `allow-licenses: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, 0BSD` (FR-009)
- [X] T026 [US3] In `.github/workflows/ci.yml` add job `secret-scan` (`timeout-minutes: 5`): `actions/checkout` with `fetch-depth: 0` and `persist-credentials: false`, then run the official gitleaks container `ghcr.io/gitleaks/gitleaks` pinned by `@sha256:` digest as `gitleaks git /repo --redact --verbose --exit-code 1 --log-opts "<range>"`, mounting the workspace at `/repo`; range is `BASE..HEAD` from `github.event.pull_request.base.sha`/`head.sha` on PRs and `github.event.before..github.sha` on pushes, scanning full history when `before` is all zeros; pass SHAs through `env:` not inline `${{ }}` in `run`; if git reports dubious ownership, run the container with `--user "$(id -u):$(id -g)"`

**Checkpoint**: All six checks from `contracts/ci-checks.md` defined

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T027 [P] Update `README.md` "Getting started": replace "Setup, build and test instructions will be added with the first MVP." with prerequisites (Node.js 24, or 22) and the commands `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`; keep the already-carried "Claude API first" architecture change
- [X] T028 [P] Update `CONTRIBUTING.md` "Development Setup" → "Local Setup": after the clone/upstream steps add `npm ci` and the three check commands, and point to `specs/001-foundation/contracts/scripts.md`; in "Standards" state that typecheck, lint, test, CodeQL, dependency review and secret scan must pass
- [X] T029 [P] Add to `CHANGELOG.md` under `## [Unreleased]` → `### Added`: "npm workspaces monorepo (`contracts`, `backend`, `extension`) with strict TypeScript, ESLint and Vitest." and "CI with typecheck, lint, tests, CodeQL, dependency review, secret scanning and Dependabot."
- [X] T030 Mirror CI's clean checkout: delete every `packages/*/dist/` and `*.tsbuildinfo`, run `npm ci`, then run `npm run lint` and `npm test` before `npm run typecheck` (CI's `lint` and `test` jobs never build `dist/`); both must pass because `@alchemai/contracts` resolves through the `@alchemai/source` condition (lint) and the Vitest alias (test); finally confirm `git status` shows no `dist/` or other build output
- [X] T031 Draft the PR description (Conventional Commit title, e.g. `feat: set up monorepo and CI foundation`, closes #3) listing every new dev dependency with license, version and maintenance status (Constitution VIII), and the maintainer settings from `specs/001-foundation/quickstart.md` section 3; do not open the PR without explicit approval
- [X] T033 [P] Write wiki pages in `docs/wiki/` (`Home.md`, `Architecture.md`, `Extension.md`, `Backend.md`, `Contracts.md`, `Configuration.md`, `Setup.md`, `Usage.md`, `Security-and-Data.md`, `Development.md`, `_Sidebar.md`), marking planned parts with a status note (FR-014)
- [X] T034 Create `.github/workflows/wiki.yml`: on push to `main` touching `docs/wiki/**` and on `workflow_dispatch`, job `publish` with `contents: write` only, clones `<repo>.wiki.git`, mirrors `docs/wiki/` with `rsync --delete`, commits as `github-actions[bot]` and pushes only when changed; link the wiki from `README.md` and `CONTRIBUTING.md`
- [ ] T032 After the PR is open and approved to run: walk through `specs/001-foundation/quickstart.md` section 4 and record results in the PR

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none. T003 depends on T001.
- **Foundational (Phase 2)**: depends on Setup. T005–T007 parallel after T004; T008 after T005–T007; T009 last.
- **US1 (Phase 3)**: depends on Foundational.
- **US2 (Phase 4)**: depends on Foundational; checks only go green once US1 is done (lint and test configs).
- **US3 (Phase 5)**: T023, T024 depend only on Foundational; T025, T026 depend on T020 (`ci.yml` exists).
- **Polish (Phase 6)**: depends on all stories.

### User Story Dependencies

- **US1 (P1)**: independent after Foundational.
- **US2 (P1)**: workflow can be written in parallel with US1, but its `lint` and `test` jobs need US1 to pass.
- **US3 (P2)**: CodeQL and Dependabot independent; `ci.yml` jobs sequential after US2's T020.

### Parallel Opportunities

- T002 with T001
- T005, T006, T007
- T010–T017 (all different files)
- T023, T024 alongside US1 or US2
- T027, T028, T029

---

## Parallel Example: User Story 1

```text
Task: "Create eslint.config.js"                                (T010)
Task: "Create root vitest.config.ts"                           (T011)
Task: "Create packages/{contracts,backend,extension}/vitest.config.ts" (T012–T014)
Task: "Create smoke tests in packages/*/src/index.test.ts"     (T015–T017)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup → Phase 2 Foundational
2. Phase 3 US1 → **STOP and VALIDATE** with quickstart.md sections 1–2

### Incremental Delivery

1. Foundation + US1 → local workflow works
2. US2 → PR checks enforce it
3. US3 → security scanning and Dependabot
4. Polish → docs, CHANGELOG, PR

One PR closes issue #3; the phases are commit boundaries, each committed only with explicit approval.

---

## Notes

- `dist/` is git-ignored; never commit build output.
- No task may add repository secrets, real keys or calls to model providers.
- Repository settings (secret scanning, push protection, branch protection) are a maintainer step,
  not a code task; see quickstart.md section 3.
