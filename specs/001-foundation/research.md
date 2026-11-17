# Research: Foundation

All Technical Context items are resolved below. Exact package versions are picked at implementation
time: the latest stable release that is at least two weeks old, except when a newer release is needed
to fix a known vulnerability. TypeScript stays on 6.0.x because `typescript-eslint` supports `<6.1`.

## R1. Node.js version

- **Decision**: Node.js 24 (active LTS) in CI and `.nvmrc`; root `engines.node` set to `^22.13.0 || >=24`,
  the narrowest range ESLint and Vitest support.
- **Rationale**: The constitution requires the active LTS. Node 22 stays allowed so a contributor on
  the previous LTS is not blocked, and so `backend` can fall back if the Azure Functions runtime lags.
- **Alternatives considered**: Node 22 only (maintenance LTS, violates "active LTS"); CI matrix 22 + 24
  (doubles CI time with no current requirement, YAGNI).
- **Follow-up**: confirm Azure Functions Node 24 GA support when `backend` gets its first endpoint.

## R2. Package layout and naming

- **Decision**: `packages/contracts`, `packages/backend`, `packages/extension`, named
  `@alchemai/contracts`, `@alchemai/backend`, `@alchemai/extension`, all `"private": true`.
- **Rationale**: `packages/*` is one workspace glob and keeps the root uncluttered; scoped names avoid
  collisions and make internal imports obvious.
- **Alternatives considered**: top-level `contracts/`, `backend/`, `extension/` folders (mixes with
  repo docs and assets at the root); `apps/` + `packages/` split (extra structure for three packages).

## R3. Package manager

- **Decision**: npm workspaces with one root `package-lock.json`; `npm ci` in CI.
- **Rationale**: Named in the issue; ships with Node, no extra tool for contributors.
- **Alternatives considered**: pnpm, Yarn (extra tooling and onboarding step, not requested).

## R4. TypeScript configuration

- **Decision**: `tsconfig.base.json` at the root with `strict`, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noImplicitOverride`, `verbatimModuleSyntax`, `module`/`moduleResolution`
  `NodeNext`, `target` ES2023. Each package has a `composite` `tsconfig.json` extending it. A root
  `tsconfig.json` lists the three as project references; `typecheck` runs `tsc -b`.
- **Rationale**: Project references give incremental builds and mirror FR-003 (`backend` and
  `extension` reference only `contracts`); the rule itself is enforced by ESLint (R5), because npm
  workspace links let a cross import resolve regardless of references. A `@alchemai/source` export
  condition plus `customConditions` lets TypeScript and ESLint read `contracts` source without a
  build, so `lint` runs on a clean checkout and a type error fails only `typecheck`. `NodeNext`
  produces ESM that both the Function App and a bundled extension can consume.
- **Alternatives considered**: one root tsconfig with path aliases (cannot enforce dependency
  direction); `moduleResolution: Bundler` everywhere (too lax for `backend` and `contracts`, which run
  unbundled on Node).
- **Note**: `extension` may switch to `Bundler` resolution when its bundler is added; out of scope.

## R5. Linting

- **Decision**: ESLint flat config (`eslint.config.js`) at the root using `@eslint/js` recommended and
  `typescript-eslint` `strictTypeChecked` + `stylisticTypeChecked`, with `projectService` enabled.
  `@typescript-eslint/no-explicit-any` and `no-non-null-assertion` set to `error`. `no-restricted-imports`
  per package enforces FR-003. `lint` runs `eslint . --max-warnings 0` with no build step.
- **Rationale**: Type-aware rules catch unsafe `any` flows that `tsc` alone does not; `error` level
  turns Principle V into a hard gate, with justified exceptions done via inline disables in review.
- **Alternatives considered**: Biome (fast, but weaker type-aware coverage); per-package ESLint configs
  (duplication, no current need).

## R6. Formatting

- **Decision**: No formatter in this feature; rely on `.editorconfig` and ESLint stylistic rules.
- **Rationale**: Not requested in the issue; YAGNI. Can be added later as a separate change.
- **Alternatives considered**: Prettier (adds a dependency and a CI check not asked for).

## R7. Testing

- **Decision**: Vitest at the root with `test.projects` pointing at `packages/*`; each package has its
  own `vitest.config.ts` (name, environment `node`) and one smoke test. Root `test` runs `vitest run`.
  Coverage is not enforced yet.
- **Rationale**: One command, one process, per-package configs ready for differing environments
  (`extension` will later need `jsdom`).
- **Alternatives considered**: `npm run test --workspaces` (three processes, slower, scattered output);
  Jest (slower ESM/TypeScript story).

## R8. CI workflow

- **Decision**: `.github/workflows/ci.yml` on `pull_request` to `main` and `push` to `main`, with
  jobs `typecheck`, `lint`, `test`. Each job: checkout, `actions/setup-node` with `node-version-file:
  .nvmrc` and npm cache, `npm ci`, run the script. Top-level `permissions: contents: read`;
  `concurrency` cancels superseded runs per ref; `timeout-minutes` per job.
- **Rationale**: Separate jobs report separate status checks (FR-007) and run in parallel.
- **Alternatives considered**: one job with three steps (single status check, harder to read).

## R9. SAST

- **Decision**: CodeQL advanced setup in `.github/workflows/codeql.yml`, language
  `javascript-typescript`, `build-mode: none`, query suite `security-extended`, on PRs, pushes to
  `main` and weekly.
- **Rationale**: Versioned in the repo and reviewable, unlike default setup; `security-extended`
  suits code that handles tokens.
- **Alternatives considered**: CodeQL default setup (settings-only, not visible in review); Semgrep
  (extra tool, CodeQL is native and free for public repos).

## R10. SCA and license policy

- **Decision**: Dependabot alerts (repo setting) plus `actions/dependency-review-action` on PRs with
  `fail-on-severity: moderate` and `allow-licenses: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC,
  0BSD`.
- **Rationale**: Covers Principle VIII's permissive-license rule and VII's SCA requirement in one check.
  The OSS Licensing Guidelines list MIT, BSD and Apache-2.0 as compatible; ISC and 0BSD are added as
  MIT-equivalent permissive licenses, needed because core npm tooling (e.g. `semver`) uses ISC.
  BlueOak-1.0.0 (permissive, OSI-approved) is added because the patched `minimatch` uses it.
  `lightningcss` (MPL-2.0, pulled in by `vite` for Vitest) is allowed by name only via
  `allow-dependencies-licenses`: it is test tooling and never distributed. MPL-2.0 is not allowed
  in general.
- **Alternatives considered**: `npm audit` in CI (no license check, noisy); third-party license
  checkers (another dependency); MIT/BSD/Apache-2.0 only (fails on the existing ESLint and TypeScript
  dependency tree).

## R11. Secret scanning

- **Decision**: GitHub secret scanning with push protection (repo settings) plus a CI job running the
  gitleaks CLI (MIT) from its official container image, pinned by digest, scanning the PR commit range.
- **Rationale**: The constitution requires secret scanning in CI; GitHub's native scanning is not a
  status check. The gitleaks GitHub Action requires a paid license for organization repos, the CLI
  does not.
- **Alternatives considered**: `gitleaks/gitleaks-action` (license key for orgs); TruffleHog (AGPL
  tool; avoided to keep the license review simple).

## R12. Dependabot

- **Decision**: `.github/dependabot.yml` with `npm` (directory `/`, weekly, grouped minor/patch into one
  PR, majors separate) and `github-actions` (directory `/`, weekly, grouped).
- **Rationale**: Grouping limits PR noise; actions are pinned by SHA, so Dependabot is how they get
  updated.
- **Alternatives considered**: Renovate (more powerful, extra app to install).

## R13. Action pinning

- **Decision**: Every action pinned to a full commit SHA with the version as a trailing comment.
- **Rationale**: Supply-chain hardening per the OSS Security Guidelines and OpenSSF Scorecard; FR-012.
